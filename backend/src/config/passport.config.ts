import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt"
import { config } from "./app.config"
import passport from "passport"
import { findUserById } from "../services/user.service"

interface JwtPayload {
  userId: string
}

// Get the JWT secret from header, done by passport-jwt
const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
  audience: ["user"],
  algorithms: ["HS256"],
}

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done) => {
    try {
      const user = await findUserById(payload.userId)
      if (!user) {
        return done(null, false)
      }
      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  })
)

passport.serializeUser((user: any, done) => {
  done(null, user)
})

passport.deserializeUser((user: any, done) => {
  done(null, user)
})

export const passportAuthenticateJwt = passport.authenticate("jwt", {
  session: false,
})
