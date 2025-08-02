import { validate } from "class-validator"
import { HTTPSTATUS } from "../config/http.config"
import { RegisterDto } from "../database/dto/auth.dto"
import { asyncHandler } from "../middlewares/asyncHandler.middleware"
import { plainToInstance } from "class-transformer"
import {
  asyncHandlerAndValidate,
  withValidation,
} from "../middlewares/withValidation.middleware"
import { registerService } from "../services/auth.service"

export const registerController = asyncHandlerAndValidate(
  RegisterDto,
  "body",
  async (req, res, registerDto) => {
    console.log("registerController dto", registerDto)
    const { user } = await registerService(registerDto)
    res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "User created successfully", user })
  }
)
