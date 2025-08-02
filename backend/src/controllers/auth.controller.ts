import { validate } from "class-validator"
import { HTTPSTATUS } from "../config/http.config"
import { LoginDto, RegisterDto } from "../database/dto/auth.dto"
import { asyncHandler } from "../middlewares/asyncHandler.middleware"
import { plainToInstance } from "class-transformer"
import {
  asyncHandlerAndValidate,
  withValidation,
} from "../middlewares/withValidation.middleware"
import { loginService, registerService } from "../services/auth.service"

export const registerController = asyncHandlerAndValidate(
  RegisterDto,
  "body",
  async (req, res, registerDto) => {
    const { user } = await registerService(registerDto)
    res
      .status(HTTPSTATUS.CREATED)
      .json({ message: "User created successfully", user })
  }
)

export const loginController = asyncHandlerAndValidate(
  LoginDto,
  "body",
  async (req, res, loginDto) => {
    const { user } = await loginService(loginDto)
    res
      .status(HTTPSTATUS.OK)
      .json({ message: "User logged in successfully", user })
  }
)
