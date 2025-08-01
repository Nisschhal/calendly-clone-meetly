export const getEnv = (key: string, defaultValue: string = "") => {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue === "") {
      throw new Error(`Environment variable ${key} is required`)
    }
    return defaultValue
  }
  return value
}
