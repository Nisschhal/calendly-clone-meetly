import bcryptjs from "bcryptjs"

export const hashValue = async (
  value: string,
  saltRounds: number = 10
): Promise<any> => {
  await bcryptjs.hash(value, saltRounds)
}

export const compareValue = async (
  value: string,
  hashedValue: string
): Promise<any> => {
  await bcryptjs.compare(value, hashedValue)
}
