import { AppDataSource } from "../config/db.config"
import { CreateEventDto, EventIdDto } from "../database/dto/event.dto"
import { Event, EventLocationEnumType } from "../database/entities/event.entity"
import { User } from "../database/entities/user.entity"
import { BadRequestException, NotFoundException } from "../utils/app-error"
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

export const toggleEventPrivacyService = async (
  userId: string,
  eventId: string
) => {
  const eventRepo = AppDataSource.getRepository(Event)
  const event = await eventRepo.findOne({
    where: {
      id: eventId,
      user: { id: userId },
    },
  })
  if (!event) {
    throw new BadRequestException("Event not found!")
  }

  event.isPrivate = !event.isPrivate
  await eventRepo.save(event)

  return event
}

export const getPublicEventsByUsernameService = async (username: string) => {
  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.events", "event", "event.isPrivate = :isPrivate", {
      isPrivate: false,
    })
    .where("user.username = :username", { username })
    .select(["user.id", "user.name", "user.imageUrl"])
    .addSelect([
      "event.id",
      "event.title",
      "event.description",
      "event.slug",
      "event.duration",
      "event.locationType",
    ])
    .orderBy("event.created_at", "DESC")
    .getOne()

  if (!user) {
    throw new NotFoundException("User not found")
  }

  return {
    user: {
      name: user.name,
      username: username,
      imageUrl: user.imageUrl,
    },
    events: user.events,
  }
}

export const getPublicEventsByUsernameAndSlugService = async (
  username: string,
  slug: string
) => {
  const userRepository = AppDataSource.getRepository(User)
  const user = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.events", "event", "event.isPrivate = :isPrivate", {
      isPrivate: false,
    })
    .where("user.username = :username", { username })
    .andWhere("event.slug = :slug", { slug })
    .select(["user.id", "user.name", "user.imageUrl"])
    .addSelect([
      "event.id",
      "event.title",
      "event.description",
      "event.slug",
      "event.duration",
      "event.locationType",
    ])
    .orderBy("event.created_at", "DESC")
    .getOne()

  if (!user) {
    throw new NotFoundException("User not found")
  }

  return {
    user: {
      name: user.name,
      username: username,
      imageUrl: user.imageUrl,
      slug: slug,
    },
    events: user.events,
  }
}

export const deleteEventService = async (userId: string, eventId: string) => {
  const eventRepo = AppDataSource.getRepository(Event)
  const event = await eventRepo.findOne({
    where: {
      id: eventId,
      user: { id: userId },
    },
  })
  if (!event) {
    throw new NotFoundException("Event not found!")
  }
  await eventRepo.remove(event)
  return { event, success: true }
}
