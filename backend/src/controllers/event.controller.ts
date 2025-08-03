import { HTTPSTATUS } from "../config/http.config"
import { CreateEventDto, EventIdDto } from "../database/dto/event.dto"
import { asyncHandlerAndValidate } from "../middlewares/withValidation.middleware"
import e, { Request, Response } from "express"
import {
  createEventService,
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
