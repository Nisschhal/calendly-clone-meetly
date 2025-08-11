import { Request, Response } from "express"
import { HTTPSTATUS } from "../config/http.config"
import { asyncHandler } from "../middlewares/asyncHandler.middleware"
import {
  checkIntegrationService,
  connectAppService,
  createIntegrationService,
  getUserIntegrationsService,
} from "../services/integration.service"
import { asyncHandlerAndValidate } from "../middlewares/withValidation.middleware"
import { AppTypeDTO } from "../database/dto/integration"
import {
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
  IntegrationProviderEnum,
} from "../database/entities/integration.entity"
import { config } from "../config/app.config"
import { decodeState } from "../utils/helper"
import { googleOAuth2Client } from "../config/oauth.config"

const CLIENT_APP_URL = config.FRONTEND_INTEGRATION_URL

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

export const connectAppController = asyncHandlerAndValidate(
  AppTypeDTO,
  "params",
  async (req: Request, res: Response, appTypeDto: AppTypeDTO) => {
    const userId = req.user?.id as string

    const { url } = await connectAppService(userId, appTypeDto.appType)

    return res.status(HTTPSTATUS.OK).json({
      message: "App connection initiated successfully",
      url,
    })
  }
)

export const googleOAuthCallbackController = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query
    const CLIENT_URL = `${CLIENT_APP_URL}?app_type=google`
    try {
      if (!code || typeof code !== "string") {
        return res.redirect(`${CLIENT_URL}&error=Invalid authorization code`)
      }
      if (!state || typeof state !== "string") {
        return res.redirect(`${CLIENT_URL}&error=Invalid state parameter`)
      }
      const { userId, appType } = decodeState(state)
      if (!userId || !appType) {
        return res.redirect(`${CLIENT_URL}&error=User ID or app type missing`)
      }
      const { tokens } = await googleOAuth2Client.getToken(code)
      if (!tokens.access_token || !tokens.refresh_token) {
        return res.redirect(`${CLIENT_URL}&error=Failed to retrieve tokens`)
      }
      await createIntegrationService({
        userId,
        provider: IntegrationProviderEnum.GOOGLE,
        category: IntegrationCategoryEnum.CALENDAR_AND_VIDEO_CONFERENCING,
        app_type: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date || null,
        metadata: {
          scope: tokens.scope || "",
          token_type: tokens.token_type || "",
        },
      })
      return res.redirect(`${CLIENT_URL}&success=true`)
    } catch (error: any) {
      console.error("Google OAuth callback error:", error.message)
      return res.redirect(`${CLIENT_URL}&error=Authentication failed`)
    }
  }
)
