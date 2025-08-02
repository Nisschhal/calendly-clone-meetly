import { AppDataSource } from "../config/db.config"
import { RegisterDto } from "../database/dto/auth.dto"
import { User } from "../database/entities/user.entity"
import { BadRequestException } from "../utils/app-error"
import { v4 as uuidv4 } from "uuid"
export const registerService = async (registerDto: RegisterDto) => {
  const userRepos = AppDataSource.getRepository(User)
  const existingUser = await userRepos.findOneBy({ email: registerDto.email })
  if (existingUser) {
    throw new BadRequestException("User already exists!")
  }

  const username = await generateUsername(registerDto.name)
  const user = userRepos.create({
    ...registerDto,
    username,
  })

  await userRepos.save(user)

  return { user }
}

// Check and Generate a unique username
async function generateUsername(name: string): Promise<string> {
  const cleanName = name.replace("/s+/g", "").toLowerCase()
  const baseUsername = cleanName

  const uuidSuffix = uuidv4().replace(/\s+/g, "").slice(0, 4)
  const userRepo = AppDataSource.getRepository(User)
  let username = `${baseUsername}${uuidSuffix}`

  let existingUserWithUsername = userRepo.findOneBy({ username })

  // Generate a unique username untill it doesn't exist
  while (existingUserWithUsername) {
    username = `${baseUsername}_${uuidSuffix}`
    existingUserWithUsername = userRepo.findOneBy({ username })
  }

  return username
}
