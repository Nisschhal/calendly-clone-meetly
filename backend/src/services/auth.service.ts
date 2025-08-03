import { AppDataSource } from "../config/db.config"
import { LoginDto, RegisterDto } from "../database/dto/auth.dto"
import { Availability } from "../database/entities/availability.entity"
import {
  DayAvailability,
  DayOfWeekEnum,
} from "../database/entities/day-availability.entity"
import { User } from "../database/entities/user.entity"
import { ErrorCodeEnum } from "../enums/error-code.enum"
import { BadRequestException, NotFoundException } from "../utils/app-error"
import { v4 as uuidv4 } from "uuid"
import { signJwtToken } from "../utils/jtw"
export const registerService = async (registerDto: RegisterDto) => {
  // Supabase:db Repos
  const userRepos = AppDataSource.getRepository(User)
  const availabilityRepos = AppDataSource.getRepository(Availability)
  const dayAvailabilityRepos = AppDataSource.getRepository(DayAvailability)

  const existingUser = await userRepos.findOneBy({ email: registerDto.email })
  if (existingUser) {
    throw new BadRequestException(
      "User already exists!",
      ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS
    )
  }

  // create user
  const username = await generateUsername(registerDto.name)
  console.log("registerDto", registerDto)
  const user = userRepos.create({
    name: registerDto.name,
    username,
    email: registerDto.email,
    password: registerDto.password,
  })

  // create availability

  const availability = availabilityRepos.create({
    timeGap: 30,
    days: Object.values(DayOfWeekEnum).map((day) => {
      return dayAvailabilityRepos.create({
        day,
        startTime: new Date(`2025-08-02T09:00:00.000Z`),
        endTime: new Date(`2025-08-02T17:00:00.000Z`),
        isAvailable:
          day !== DayOfWeekEnum.SUNDAY && day !== DayOfWeekEnum.SATURDAY,
      })
    }),
  })

  user.availability = availability

  await userRepos.save(user)

  return { user: user.omitPassword() }
}

// Check and Generate a unique username

async function generateUsername(name: string): Promise<string> {
  const cleanName = name.replace(/\s+/g, "").toLowerCase()
  const baseUsername = cleanName

  const uuidSuffix = uuidv4().replace(/\s+/g, "").slice(0, 4)
  const userRepository = AppDataSource.getRepository(User)

  let username = `${baseUsername}${uuidSuffix}`
  let existingUser = await userRepository.findOne({
    where: { username },
  })

  while (existingUser) {
    username = `${baseUsername}${uuidv4().replace(/\s+/g, "").slice(0, 4)}`
    existingUser = await userRepository.findOne({
      where: { username },
    })
  }

  return username
}

// export const loginService = async (loginDto: LoginDto) => {
//   const userRepository = AppDataSource.getRepository(User);

//   const user = await userRepository.findOne({
//     where: { email: loginDto.email },
//   });

//   if (!user) {
//     throw new NotFoundException("User not found");
//   }

//   const isPasswordValid = await user.comparePassword(loginDto.password);
//   if (!isPasswordValid) {
//     throw new UnauthorizedException("Invalid email/password");
//   }

//   const { token, expiresAt } = signJwtToken({ userId: user.id });

//   return {
//     user: user.omitPassword(),
//     accessToken: token,
//     expiresAt,
//   };
// };

export const loginService = async (loginDto: LoginDto) => {
  const userRepo = AppDataSource.getRepository(User)
  const existingUser = await userRepo.findOneBy({ email: loginDto.email })
  if (!existingUser) {
    throw new NotFoundException(
      "User not found",
      ErrorCodeEnum.AUTH_USER_NOT_FOUND
    )
  }

  const isPasswordValid = await existingUser.comparePassword(loginDto.password)
  if (!isPasswordValid) {
    throw new BadRequestException(
      "Invalid email/password",
      ErrorCodeEnum.AUTH_INVALID_EMAIL_PASSWORD
    )
  }

  const { token, expiresAt } = signJwtToken({ userId: existingUser.id })

  return { user: existingUser.omitPassword(), accessToken: token, expiresAt }
}
