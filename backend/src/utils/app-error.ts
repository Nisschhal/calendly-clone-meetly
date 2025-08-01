import { HTTPSTATUS, HttpStatusCodeType } from "../config/http.config"
import { ErrorCodeEnum, ErrorCodeEnumType } from "../enums/error-code.enum"

// App Error or Base Error which extends Error

/**
 * Base class for application-specific errors.
 * Extends the built-in Error class and adds additional properties for HTTP status code
 * and application-specific error codes.
 */
export class AppError extends Error {
  /**
   * HTTP status code associated with the error.
   */
  public statusCode: HttpStatusCodeType

  /**
   * Application-specific error code.
   */
  public errorCode?: ErrorCodeEnumType

  /**
   * Constructs a new AppError instance.
   * @param message - The error message.
   * @param statusCode - The HTTP status code (defaults to INTERNAL_SERVER_ERROR).
   * @param errorCode - The application-specific error code.
   */
  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCodeEnumType
  ) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    Error.captureStackTrace(this, this.constructor) // for capturing stack
  }
}

export class HttpException extends AppError {
  constructor(
    message = "Http Exception Error",
    statusCode: HttpStatusCodeType,
    errorCode?: ErrorCodeEnumType
  ) {
    super(message, statusCode, errorCode || ErrorCodeEnum.CUSTOM_HTTP_ERROR)
  }
}

export class InternalServerException extends AppError {
  constructor(
    message = "Internal Server Error",
    errorCode?: ErrorCodeEnumType
  ) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
    )
  }
}

export class NotFoundException extends AppError {
  constructor(message = "Resource Not Found", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
    )
  }
}

export class BadRequestException extends AppError {
  constructor(message = "Bad Request", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCodeEnum.VALIDATION_ERROR
    )
  }
}

export class UnauthorizedAccess extends AppError {
  constructor(message = "Unauthorized Access", errorCode?: ErrorCodeEnumType) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
    )
  }
}
