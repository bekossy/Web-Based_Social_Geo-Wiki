import {Response} from "express"
import jwt from "jsonwebtoken"
import {env} from "../lib/env"

const createJWT = ({payload}: {payload: {user: any; refreshToken?: string}}) =>
    jwt.sign(payload, env.JWT_SECRET)

export const isTokenValid = (token: string): any => jwt.verify(token, env.JWT_SECRET)

export const attachCookiesToResponse = ({
    res,
    user,
    refreshToken,
}: {
    res: Response
    user: any
    refreshToken?: string
}) => {
    const refreshTokenJWT = createJWT({payload: {user, refreshToken}})
    const accessTokenJWT = createJWT({payload: {user}})

    const oneDay = 1000 * 60 * 60 * 24
    const thirtyDays = 1000 * 60 * 60 * 24 * 30

    const isProduction = process.env.NODE_ENV === "production"

    res.cookie("accessToken", accessTokenJWT, {
        httpOnly: true,
        secure: isProduction,
        signed: true,
        expires: new Date(Date.now() + oneDay),
        sameSite: isProduction ? "none" : "lax",
    })

    res.cookie("refreshToken", refreshTokenJWT, {
        httpOnly: true,
        secure: isProduction,
        signed: true,
        expires: new Date(Date.now() + thirtyDays),
        sameSite: isProduction ? "none" : "lax",
    })

    return {refreshToken: refreshTokenJWT}
}
