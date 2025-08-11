export const getEnv = (key: string, defaultValue: string = "") => {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue === "") {
      throw new Error(`Environment variable ${key} is required`)
    }
    console.warn(
      `Environment variable ${key} is not set, using default value: ${defaultValue}`
    )
    return defaultValue
  }
  return value
}
