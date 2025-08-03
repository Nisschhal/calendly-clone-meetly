import { Router } from "express"
import {
  eventController,
  getUserEventController,
} from "../controllers/event.controller"
import { passportAuthenticateJwt } from "../config/passport.config"

const eventRoutes = Router()

eventRoutes.post("/create", passportAuthenticateJwt, eventController)
eventRoutes.get("/all", passportAuthenticateJwt, getUserEventController)

export default eventRoutes
