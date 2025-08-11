import { Router } from "express"
import {
  createMeetingForGuestController,
  getUserMeetingsController,
} from "../controllers/meeting.controller"
import { passportAuthenticateJwt } from "../config/passport.config"
import { cancelMeetingService } from "../services/meeting.service"

const meetingRoutes = Router()

meetingRoutes.get(
  "/user/all",
  passportAuthenticateJwt,
  getUserMeetingsController
)

meetingRoutes.post("/public/create", createMeetingForGuestController)

meetingRoutes.put(
  "/cancel/:meetingId",
  passportAuthenticateJwt,
  cancelMeetingService
)

export default meetingRoutes
