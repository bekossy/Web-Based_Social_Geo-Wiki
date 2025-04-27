import {NextFunction, Request, Response} from "express"
import {attachCookiesToResponse, isTokenValid} from "../utils/jwt"
import Token from "../models/token.model"
import {UnauthenticatedError} from "../errors"
import jwt from "jsonwebtoken"

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {accessToken, refreshToken} = req.signedCookies || {}
        const headerToken = req.headers.authorization?.split(" ")[1]

        if (headerToken) {
            const payload = isTokenValid(headerToken)
            req.user = payload.user
            return next()
        }

        if (accessToken) {
            const payload = isTokenValid(accessToken)
            req.user = payload.user
            return next()
        }

        if (refreshToken) {
            const payload = isTokenValid(refreshToken)

            const existingToken = await Token.findOne({
                userId: payload.user.userId,
                refreshToken: payload.refreshToken,
            })

            if (!existingToken || !existingToken.isValid) {
                throw new UnauthenticatedError("Invalid refresh token")
            }

            attachCookiesToResponse({
                res,
                user: payload.user,
                refreshToken: existingToken.refreshToken,
            })

            req.user = payload.user
            return next()
        }

        throw new UnauthenticatedError("No valid authentication token provided")
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new UnauthenticatedError("Invalid token")
        }
        throw error
    }
}

export default authenticateUser
