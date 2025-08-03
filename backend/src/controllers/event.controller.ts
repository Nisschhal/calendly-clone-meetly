import { HTTPSTATUS } from "../config/http.config"
import {
  CreateEventDto,
  EventIdDto,
  UserNameAndSlugDto,
  UsernameDto,
} from "../database/dto/event.dto"
import { asyncHandlerAndValidate } from "../middlewares/withValidation.middleware"
import e, { Request, Response } from "express"
import {
  createEventService,
  deleteEventService,
  getPublicEventsByUsernameAndSlugService,
  getPublicEventsByUsernameService,
  getUserEventService,
  toggleEventPrivacyService,
} from "../services/event.service"
import { asyncHandler } from "../middlewares/asyncHandler.middleware"

export const eventController = asyncHandlerAndValidate(
  CreateEventDto,
  "body",
  async (req: Request, res: Response, dto: CreateEventDto) => {
    const userId = req.user?.id as string

    const event = await createEventService(userId, dto)
    return res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "Event created successfully", event })
  }
)

export const getUserEventController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string
    const { events, username } = await getUserEventService(userId)
    return res.status(HTTPSTATUS.OK).json({
      message: "User event fetched successfully",
      data: { events, username },
    })
  }
)

export const toggleEventPrivacyController = asyncHandlerAndValidate(
  EventIdDto,
  "params",
  async (req: Request, res: Response, eventIdDto: EventIdDto) => {
    const userId = req.user?.id as string

    const event = await toggleEventPrivacyService(userId, eventIdDto.eventId)

    return res.status(HTTPSTATUS.OK).json({
      message: `Event set to ${
        event.isPrivate ? "private" : "public"
      } successfully`,
      data: { event },
    })
  }
)

export const getPublicEventByUsernameController = asyncHandlerAndValidate(
  UsernameDto,
  "params",
  async (req: Request, res: Response, usernameDto: UsernameDto) => {
    const { events, user } = await getPublicEventsByUsernameService(
      usernameDto.username
    )
    return res.status(HTTPSTATUS.OK).json({
      message: "Username event fetched successfully",
      user,
      events,
    })
  }
)
export const getPublicEventByUsernameAndSlugController =
  asyncHandlerAndValidate(
    UserNameAndSlugDto,
    "params",
    async (req: Request, res: Response, usernameDto: UserNameAndSlugDto) => {
      const { events, user } = await getPublicEventsByUsernameAndSlugService(
        usernameDto.username,
        usernameDto.slug
      )
      return res.status(HTTPSTATUS.OK).json({
        message: "Username and Slug event fetched successfully",
        user,
        events,
      })
    }
  )

export const deleteEventController = asyncHandlerAndValidate(
  EventIdDto,
  "params",
  async (req: Request, res: Response, eventIdDto: EventIdDto) => {
    const userId = req.user?.id as string
    const event = await deleteEventService(userId, eventIdDto.eventId)

    return res.status(HTTPSTATUS.OK).json({
      message: "Event deleted successfully",
      deletedEvent: event,
    })
  }
)
