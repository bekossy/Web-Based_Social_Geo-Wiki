import {NextFunction, Request, Response} from "express"
import {attachCookiesToResponse, isTokenValid} from "../utils/jwt"

import Token from "../models/token.model"
import {UnauthenticatedError} from "../errors"

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const {accessToken, refreshToken} = req.signedCookies

    try {
        if (accessToken) {
            const payload = isTokenValid(accessToken)

            req.user = payload.user
            return next()
        }

        const payload = isTokenValid(refreshToken)

        const existingToken = await Token.findOne({
            userId: payload.user.userId,
            refreshToken: payload.refreshToken,
        })

        if (!existingToken || !existingToken?.isValid) {
            throw new UnauthenticatedError("Authentication Invalid")
        }

        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken,
        })

        req.user = payload.user

        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication Invalid")
    }
}

export default authenticateUser
