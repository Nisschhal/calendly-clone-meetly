import { Request, Response } from "express"
import { asyncHandler } from "../middlewares/asyncHandler.middleware"
import { HTTPSTATUS } from "../config/http.config"
import {
  getUserAvailabilityService,
  updateAvailabilityService,
} from "../services/availability.service"
import { asyncHandlerAndValidate } from "../middlewares/withValidation.middleware"
import { UpdateAvailabilityDto } from "../database/dto/availability.dto"

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
