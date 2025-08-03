import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
