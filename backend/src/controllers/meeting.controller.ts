import { HTTPSTATUS } from "../config/http.config"
import { MeetingFilterEnum, MeetingFilterEnumType } from "../enums/meeting.enum"
import { asyncHandler } from "../middlewares/asyncHandler.middleware"
import { Request, Response } from "express"

import { asyncHandlerAndValidate } from "../middlewares/withValidation.middleware"
import { CreateMeetingDto } from "../database/dto/meeting.dto"
import {
  createMeetBookingForGuestService,
  getUserMeetingsService,
} from "../services/meeting.service"

export const getUserMeetingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string

    const filter =
      (req.query.filter as MeetingFilterEnumType) || MeetingFilterEnum.UPCOMING

    const meetings = await getUserMeetingsService(userId, filter)

    return res.status(HTTPSTATUS.OK).json({
      message: "User meetings fetched successfully",
      // Here you would typically fetch the user's meetings from the database
      // For now, we will return a placeholder response
      meetings,
    })
  }
)

export const createMeetingForGuestController = asyncHandlerAndValidate(
  CreateMeetingDto,
  "body",
  async (req: Request, res: Response, dto: CreateMeetingDto) => {
    const { meetingLink, meeting } = await createMeetBookingForGuestService(dto)

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Meeting created successfully",
      data: {
        meetingLink,
        meeting,
      },
    })
  }
)
