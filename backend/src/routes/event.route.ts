import { Router } from "express"
import {
  deleteEventController,
  eventController,
  getPublicEventByUsernameAndSlugController,
  getPublicEventByUsernameController,
  getUserEventController,
  toggleEventPrivacyController,
} from "../controllers/event.controller"
import { passportAuthenticateJwt } from "../config/passport.config"

const eventRoutes = Router()

eventRoutes.post("/create", passportAuthenticateJwt, eventController)
eventRoutes.get("/all", passportAuthenticateJwt, getUserEventController)

// public routes without jwt token/auth
eventRoutes.get("/public/:username", getPublicEventByUsernameController)

eventRoutes.get(
  "/public/:username/:slug",
  getPublicEventByUsernameAndSlugController
)

eventRoutes.put(
  "/toggle-privacy/:eventId",
  passportAuthenticateJwt,
  toggleEventPrivacyController
)

eventRoutes.delete(
  "/delete/:eventId",
  passportAuthenticateJwt,
  deleteEventController
)

export default eventRoutes
