import { Router } from "express"
import { passportAuthenticateJwt } from "../config/passport.config"
import {
  getUserAvailabilityController,
  updateAvailabilityController,
} from "../controllers/availability.controller"

const availabilityRoutes = Router()

availabilityRoutes.get(
  "/me",
  passportAuthenticateJwt,
  getUserAvailabilityController
)
availabilityRoutes.put(
  "/update",
  passportAuthenticateJwt,
  updateAvailabilityController
)

export default availabilityRoutes
