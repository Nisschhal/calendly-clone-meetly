import { Request, Response } from "express"
import { asyncHandler } from "../middlewares/asyncHandler.middleware"
import { HTTPSTATUS } from "../config/http.config"
import {
  getAvailabilityForPublicEventService,
  getUserAvailabilityService,
  updateAvailabilityService,
} from "../services/availability.service"
import { asyncHandlerAndValidate } from "../middlewares/withValidation.middleware"
import { UpdateAvailabilityDto } from "../database/dto/availability.dto"
import { EventIdDto } from "../database/dto/event.dto"

export const getUserAvailabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string

    const availability = await getUserAvailabilityService(userId)

    return res.status(HTTPSTATUS.OK).json({
      message: "User availability fetched successfully",
      availability,
    })
  }
)

export const updateAvailabilityController = asyncHandlerAndValidate(
  UpdateAvailabilityDto,
  "body",
  async (
    req: Request,
    res: Response,
    updateAvailabilityDto: UpdateAvailabilityDto
  ) => {
    const userId = req.user?.id as string

    const availability = await updateAvailabilityService(
      userId,
      updateAvailabilityDto
    )

    return res.status(HTTPSTATUS.OK).json({
      message: "User availability updated successfully",
      availability,
    })
  }
)

export const getAvailabilityForPublicEventController = asyncHandlerAndValidate(
  EventIdDto,
  "params",
  async (req: Request, res: Response, eventIdDto: EventIdDto) => {
    const availability = await getAvailabilityForPublicEventService(
      eventIdDto.eventId
    )
    return res.status(HTTPSTATUS.OK).json({
      message: "Public availability fetched successfully",
      // Here you would typically fetch the public availability based on the event ID
      // For now, we will return a placeholder response
    })
  }
)

export const deleteUserAvailabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string

    const availabilityService = await getUserAvailabilityService(userId)
    if (!availabilityService) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        message: "User availability not found",
      })
    }

    // Logic to delete user availability goes here
    // For now, we will just return a success message
    // You would typically call a service method to handle the deletion

    return res.status(HTTPSTATUS.OK).json({
      message: "User availability deleted successfully",
    })
  }
)
// Note: The actual deletion logic should be implemented in the service layer.
