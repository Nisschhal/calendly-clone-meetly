import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator"
import { EventLocationEnumType } from "../entities/event.entity"

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description: string

  @IsNumber()
  @IsNotEmpty()
  duration: number

  @IsNotEmpty()
  @IsEnum(EventLocationEnumType)
  locationType: EventLocationEnumType
}

export class EventIdDto {
  @IsUUID(4, { message: "Invalid event id" })
  @IsNotEmpty()
  eventId: string
}

export class UsernameDto {
  @IsString()
  @IsNotEmpty()
  username: string
}

export class UserNameAndSlugDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  slug: string
}
