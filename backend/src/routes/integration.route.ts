import { Router } from "express"
import {
  checkIntegrationController,
  connectAppController,
  getUserIntegrationsController,
  googleOAuthCallbackController,
} from "../controllers/integration.controller"
import { passportAuthenticateJwt } from "../config/passport.config"

const integrationRoutes = Router()

integrationRoutes.get(
  "/all",
  passportAuthenticateJwt,
  getUserIntegrationsController
)
integrationRoutes.get(
  "/check/:appType",
  passportAuthenticateJwt,
  checkIntegrationController
)

integrationRoutes.get(
  "/connect/:appType",
  passportAuthenticateJwt,
  connectAppController
)

integrationRoutes.get("/google/callback", googleOAuthCallbackController)

export default integrationRoutes
