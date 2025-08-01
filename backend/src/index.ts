import "dotenv/config"
import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { config } from "./config/app.config"
import { HTTPSTATUS } from "./config/http.config"
import { errorHandler } from "./middlewares/errorHandler.middleware"
import { asyncHandler } from "./middlewares/asyncHandler.middleware"

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

//
app.use(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new Error("throwing async error")
    return res.status(HTTPSTATUS.OK).json({ message: "Server is running" })
  })
)

// Error Handler
app.use(errorHandler)
//  Activate server and Listen on port
app.listen(config.PORT, () => {
  console.log(
    `Server running on port ${config.PORT} in ${config.NODE_ENV} mode`
  )
})
