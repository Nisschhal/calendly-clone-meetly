import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { config } from "./config/app.config"
import { HTTPSTATUS } from "./config/http.config"
import { errorHandler } from "./middlewares/errorHandler.middleware"
import { asyncHandler } from "./middlewares/asyncHandler.middleware"
import { BadRequestException } from "./utils/app-error"
import { initializeDatabase } from "./database/database"

import authRoutes from "./routes/auth.route"
import "./config/passport.config"
import passport from "passport"

const app = express()
const BASE_PATH = config.BASE_PATH

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
)

// Initialize Passport
app.use(passport.initialize())

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // throw new BadRequestException("throwing async error")
    res.status(HTTPSTATUS.OK).json({ message: "Server is running" })
  })
)

// Routes
app.use(`${BASE_PATH}/auth`, authRoutes)

// Error Handler
app.use(errorHandler)
//  Activate server and Listen on port
app.listen(config.PORT, async () => {
  try {
    await initializeDatabase()
    console.log(`Server is running on port ${config.PORT}`)
  } catch (error) {
    console.log(error)
  }
})
