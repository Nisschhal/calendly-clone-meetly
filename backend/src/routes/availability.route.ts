import { Router } from "express"
import { passportAuthenticateJwt } from "../config/passport.config"
import {
  deleteUserAvailabilityController,
  getAvailabilityForPublicEventController,
  getUserAvailabilityController,
  updateAvailabilityController,
} from "../controllers/availability.controller"

const availabilityRoutes = Router()

availabilityRoutes.get(
  "/me",
  passportAuthenticateJwt,
  getUserAvailabilityController
)

availabilityRoutes.get(
  "/public/:eventId",
  getAvailabilityForPublicEventController
)

availabilityRoutes.put(
  "/update",
  passportAuthenticateJwt,
  updateAvailabilityController
)

availabilityRoutes.delete(
  "/delete",
  passportAuthenticateJwt,
  deleteUserAvailabilityController
)

export default availabilityRoutes
