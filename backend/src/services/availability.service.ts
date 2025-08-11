import { Repository } from "typeorm"
import { AvailabilityReponseType } from "../@types/availability.type"
import { AppDataSource } from "../config/db.config"
import {
  DayAvailabilityDto,
  UpdateAvailabilityDto,
} from "../database/dto/availability.dto"
import { Availability } from "../database/entities/availability.entity"
import { DayOfWeekEnum } from "../database/entities/day-availability.entity"
import { User } from "../database/entities/user.entity"
import { NotFoundException } from "../utils/app-error"
import { asyncHandlerAndValidate } from "../middlewares/withValidation.middleware"
import { EventIdDto } from "../database/dto/event.dto"
import { HTTPSTATUS } from "../config/http.config"
import { Event } from "../database/entities/event.entity"
import { addDays, addMinutes, format, parseISO } from "date-fns"

export const getUserAvailabilityService = async (userId: string) => {
  const userRepo = AppDataSource.getRepository(User)
  const user = await userRepo.findOne({
    where: { id: userId },
    relations: ["availability", "availability.days"],
  })

  if (!user || !user.availability) {
    throw new NotFoundException("User not found!")
  }

  const availabilityData: AvailabilityReponseType = {
    timeGap: user.availability.timeGap,
    days: [],
  }

  user.availability.days.forEach((dayAvailability) => {
    availabilityData.days.push({
      day: dayAvailability.day,
      startTime: dayAvailability.startTime.toISOString().slice(11, 16),
      endTime: dayAvailability.endTime.toISOString().slice(11, 16),
      isAvailable: dayAvailability.isAvailable,
    })
  })

  return availabilityData
}

export const updateAvailabilityService = async (
  userId: string,
  data: UpdateAvailabilityDto
) => {
  const userRepo = AppDataSource.getRepository(User)
  const availabilityRepo = AppDataSource.getRepository(Availability)

  const user = await userRepo.findOne({
    where: { id: userId },
    relations: ["availability", "availability.days"],
  })

  if (!user) {
    throw new NotFoundException("User not found!")
  }

  const dayAvailabilityData = data.days.map(
    ({ day, isAvailable, startTime, endTime }) => {
      const baseDate = new Date().toISOString().split("T")[0]
      return {
        day: day.toUpperCase() as DayOfWeekEnum,
        startTime: new Date(`${baseDate}T${startTime}:00Z`),
        endTime: new Date(`${baseDate}T${endTime}:00Z`),
        isAvailable,
      }
    }
  )

  let updatedAvailability: Availability

  if (user.availability) {
    // Update existing availability
    updatedAvailability = await availabilityRepo.save({
      id: user.availability.id,
      timeGap: data.timeGap,
      days: dayAvailabilityData.map((day) => ({
        ...day,
        availability: { id: user.availability.id },
      })),
    })
  }

  return { success: true, availability: updatedAvailability! }
}

export const getAvailabilityForPublicEventService = async (eventId: string) => {
  const eventRepo = AppDataSource.getRepository(Event)

  const event = await eventRepo.findOne({
    where: { id: eventId, isPrivate: false },
    relations: [
      "user",
      "user.availability",
      "user.availability.days",
      "user.meetings",
    ],
  })

  if (!event || !event.user.availability) return []

  const { availability, meetings } = event.user
  const daysOfWeek = Object.values(DayOfWeekEnum)

  const availableDays = []

  for (const dayOfWeek of daysOfWeek) {
    // Get the next available date/time slot for the meeting/event of the week
    // Because now:current date/time cannot be used to generate slots as event/meeting is already happening or not available
    // this gives the cloest next available date/time/dayofWeek in this week, if not available then next week
    const nextAvailabilityDate = getNextAvailableDate(dayOfWeek)

    const dayAvailability = availability.days.find((d) => d.day === dayOfWeek)

    if (dayAvailability) {
      const slots = dayAvailability.isAvailable
        ? generateAvailabilitySlots(
            dayAvailability.startTime,
            dayAvailability.endTime,
            event.duration,
            meetings,
            format(nextAvailabilityDate, "yyyy-MM-dd"),
            availability.timeGap
          )
        : []
      availableDays.push({
        day: dayOfWeek,
        slots,
        isAvailable: dayAvailability.isAvailable,
      })
    }
  }
}

function getNextAvailableDate(dayOfWeek: DayOfWeekEnum): Date {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  const today = new Date()

  const currentDayIndex = today.getDay() // Get current day index (0-6)
  const targetDayIndex = days.indexOf(dayOfWeek) // Get index of target/incoming day index (0-6)

  // Let's calculate the difference in days
  // today  == 1 // Monday
  // dayOfWeek/target/incoming/nextthisDay == 3 // Wednesday
  // differene: target - today (3 - 1) = 2 days
  // add + 7 to get the next occurrence of the day: 2 + 7 = 9
  // module by 7 to get the next week occurrence: 9 % 7 = 2 days
  // there is a difference of 2 days , i.e. 2 days from today
  const dayUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7

  return addDays(today, dayUntilTarget)
}

function generateAvailabilitySlots(
  startTime: Date, // start time of the available day
  endTime: Date, // end time of the available day
  duration: number,
  meetings: { startTime: Date; endTime: Date }[],
  dateStart: string,
  timeGap: number = 30
) {
  const slots = []
  let slotStartTime = parseISO(
    `${dateStart}T${startTime.toISOString().slice(11, 16)}`
  )
  let slotEndTime = parseISO(
    `${dateStart}T${endTime.toISOString().slice(11, 16)}`
  )

  const now = new Date()

  const isToday = format(now, "yyyy-MM-dd") === dateStart
  while (slotStartTime < slotEndTime) {
    // check if slot is available
    // if today then check if there is starttime is greater than now

    if (!isToday || slotStartTime >= now) {
      // create the next slot end time based on the duration
      const nextSlotEndTime = new Date(startTime.getTime() + duration * 60000)
      // check if the next slot end time is within the available time range of meeting
      if (isSlotAvailable(slotStartTime, nextSlotEndTime, meetings)) {
        slots.push(format(slotStartTime, "HH:mm"))
      }
    }
    // increment the slot start time by the time gap
    slotStartTime = addMinutes(slotStartTime, timeGap)
  }

  return slots
}

function isSlotAvailable(
  slotStartTime: Date,
  slotEndTime: Date,
  meetings: { startTime: Date; endTime: Date }[]
) {
  // Check if the slot overlaps with any existing meetings
  for (const meeting of meetings) {
    // slotstart time should be less than meeting end time, meaning the slot starts before the meeting ends
    // slotend time should be greater than meeting start time, meaning the slot ends after the meeting starts
    // if both conditions are true then the slot is not available
    // if the slot overlaps with an existing meeting, return false
    if (slotStartTime < meeting.endTime && slotEndTime > meeting.startTime) {
      return false // Slot overlaps with an existing meeting
    }
  }
  return true // Slot is available
}
