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
