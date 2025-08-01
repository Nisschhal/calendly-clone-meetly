import { ErrorRequestHandler } from "express"
import { HTTPSTATUS } from "../config/http.config"

export const errorHandler: ErrorRequestHandler = (
  error: any,
  req: any,
  res: any,
  next: any
) => {
  console.log(`Error occurred on path ${req.path}: error`)
  if (error instanceof SyntaxError) {
    res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid JSON format" })
  }
  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error.message || "Unknown error",
  })
}
