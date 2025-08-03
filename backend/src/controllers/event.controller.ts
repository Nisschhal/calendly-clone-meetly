import { HTTPSTATUS } from "../config/http.config"
import { CreateEventDto } from "../database/dto/event.dto"
import { asyncHandlerAndValidate } from "../middlewares/withValidation.middleware"
import e, { Request, Response } from "express"
import {
  createEventService,
  getUserEventService,
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
