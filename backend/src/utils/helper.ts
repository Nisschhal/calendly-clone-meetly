import { encode, decode } from "js-base64"

export const encodeState = (data: any): string => {
  try {
    const encoded = encode(JSON.stringify(data))
    return encoded
  } catch (error) {
    console.error("Failed to encode state:", error)
    return ""
  }
}

export const decodeState = (encodedState: string): any => {
  try {
    const decoded = decode(encodedState)
    return JSON.parse(decoded)
  } catch (error) {
    console.error("Failed to decode state:", error)
    return null
  }
}
