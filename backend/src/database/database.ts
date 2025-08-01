import "reflect-metadata"
import { AppDataSource } from "../config/db.config"

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize()
    console.log("Database connected successfully")
  } catch (error) {
    console.log(`Database connection error: ${error}`)
    process.exit(1)
  }
}
