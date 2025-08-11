import { Router } from "express"
import {
  checkIntegrationController,
  getUserIntegrationsController,
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

export default integrationRoutes
