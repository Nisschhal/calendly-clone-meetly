import { AppDataSource } from "../config/db.config"
import { User } from "../database/entities/user.entity"

export const findUserById = async (userId: string) => {
  const userRepo = AppDataSource.getRepository(User)
  return await userRepo.findOne({ where: { id: userId } })
}
