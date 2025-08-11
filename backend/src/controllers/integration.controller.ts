import { Request, Response } from "express"
import { HTTPSTATUS } from "../config/http.config"
import { asyncHandler } from "../middlewares/asyncHandler.middleware"
import {
  checkIntegrationService,
  getUserIntegrationsService,
} from "../services/integration.service"
import { asyncHandlerAndValidate } from "../middlewares/withValidation.middleware"
import { AppTypeDTO } from "../database/dto/integration"

export const getUserIntegrationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string

    const integrations = await getUserIntegrationsService(userId)

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched user integrations successfully",
      integrations,
    })
  }
)

export const checkIntegrationController = asyncHandlerAndValidate(
  AppTypeDTO,
  "params",
  async (req: Request, res: Response, appTypeDto: AppTypeDTO) => {
    const userId = req.user?.id as string

    const isConnected = await checkIntegrationService(
      userId,
      appTypeDto.appType
    )

    return res.status(HTTPSTATUS.OK).json({
      message: "Integration checked successfully",
      isConnected,
    })
  }
)
