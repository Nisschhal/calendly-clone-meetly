import { AppDataSource } from "../config/db.config"
import { CreateEventDto } from "../database/dto/event.dto"
import { Event, EventLocationEnumType } from "../database/entities/event.entity"
import { User } from "../database/entities/user.entity"
import { BadRequestException } from "../utils/app-error"
import { slugify } from "../utils/slugify"

export const createEventService = async (
  userId: string,
  eventDto: CreateEventDto
) => {
  const eventRepo = AppDataSource.getRepository(Event)

  if (!Object.values(EventLocationEnumType).includes(eventDto.locationType)) {
    throw new BadRequestException("Invalid location type")
  }

  const slug = slugify(eventDto.title)

  const event = eventRepo.create({
    ...eventDto,
    user: { id: userId },
    slug,
  })
  const savedEvent = await eventRepo.save(event)

  return savedEvent
}

export const getUserEventService = async (userId: string) => {
  const userRepo = AppDataSource.getRepository(User)
  const user = await userRepo
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.events", "events")
    .loadRelationCountAndMap("event._count.meetings", "events.meetings")
    .where("user.id = :userId", { userId })
    .orderBy("events.created_at", "DESC")
    .getOne()
  if (!user) {
    throw new BadRequestException("User not found!")
  }
  return {
    events: user.events,
    username: user.username,
  }
}
