import { ErrorRequestHandler } from "express"
import { HTTPSTATUS } from "../config/http.config"
import { AppError } from "../utils/app-error"

export const errorHandler: ErrorRequestHandler = (
  error: any,
  req: any,
  res: any,
  next: any
) => {
  console.log(`Error occurred on path ${req.path}: `, error)
  if (error instanceof SyntaxError) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid JSON format" })
  }

  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, error: error.errorCode })
  }
  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error.message || "Unknown error",
  })
}
