import { Router } from "express"
import {
  eventController,
  getUserEventController,
  toggleEventPrivacyController,
} from "../controllers/event.controller"
import { passportAuthenticateJwt } from "../config/passport.config"

const eventRoutes = Router()

eventRoutes.post("/create", passportAuthenticateJwt, eventController)
eventRoutes.get("/all", passportAuthenticateJwt, getUserEventController)
eventRoutes.put(
  "/toggle-privacy/:eventId",
  passportAuthenticateJwt,
  toggleEventPrivacyController
)

export default eventRoutes
