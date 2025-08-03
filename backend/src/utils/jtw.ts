import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { config } from "../config/app.config"

export type AccessTPayload = {
  userId: string
}

type SignOptsAndSecret = SignOptions & {
  expiresIn: string
  secret: string
}

const defaults: SignOptions = {
  audience: ["user"],
}

const accessTokenSignOption: SignOptsAndSecret = {
  expiresIn: "1d",
  secret: config.JWT_SECRET,
}

export const signJwtToken = (
  payload: AccessTPayload,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOption
  const token = jwt.sign(payload, secret, {
    ...defaults,
    ...opts,
  })

  const decoded = jwt.decode(token) as JwtPayload | null
  const expiresAt = decoded?.exp ? decoded.exp * 1000 : null

  return {
    token,
    expiresAt,
  }
}
