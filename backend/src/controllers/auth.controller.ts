import {BadRequestError, UnauthenticatedError} from "../errors"
import crypto from "crypto"
import User from "../models/user.model"
import Token from "../models/token.model"
import {Request, Response} from "express"
import {StatusCodes} from "http-status-codes"
import {createTokenUser} from "../utils/createTokenUser"
import {attachCookiesToResponse} from "../utils/jwt"
import {generateUniqueColor} from "../utils/generateUserColor"

const register = async (req: Request, res: Response) => {
    const {username, password} = req.body

    const doesUserExist = await User.findOne({username})

    if (doesUserExist) {
        throw new BadRequestError("Username already exists")
    }

    const userColor = await generateUniqueColor()

    const user = await User.create({username, password, color: userColor})

    const tokenUser = createTokenUser(user)

    let refreshToken = crypto.randomBytes(40).toString("hex")

    const userToken = {userId: user._id, refreshToken}

    await Token.create(userToken)

    const {refreshToken: refreshTokenCookie} = attachCookiesToResponse({
        res,
        user: tokenUser,
        refreshToken,
    })

    res.status(StatusCodes.OK).json({
        user: tokenUser,

        refreshToken: refreshTokenCookie,
    })
}

const login = async (req: Request, res: Response): Promise<any> => {
    const {username, password} = req.body

    if (!username || !password) {
        throw new BadRequestError("Please provide username and password")
    }

    const user = await User.findOne({username})

    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Invalid Credentials")
    }

    const tokenUser = createTokenUser(user)

    let refreshToken = ""

    const existingToken = await Token.findOne({userId: user._id})

    if (existingToken) {
        const {isValid} = existingToken

        if (!isValid) {
            throw new UnauthenticatedError("Invalid Credentials")
        }

        refreshToken = existingToken.refreshToken

        const {refreshToken: refreshTokenCookie} = attachCookiesToResponse({
            res,
            user: tokenUser,
            refreshToken,
        })

        return res.status(StatusCodes.OK).json({user: tokenUser, refreshToken: refreshTokenCookie})
    }

    refreshToken = crypto.randomBytes(40).toString("hex")

    const userToken = {userId: user._id, refreshToken}

    await Token.create(userToken)

    const {refreshToken: refreshTokenCookie} = attachCookiesToResponse({
        res,
        user: tokenUser,
        refreshToken,
    })

    return res.status(StatusCodes.OK).json({user: tokenUser, refreshToken: refreshTokenCookie})
}

const logout = async (req: Request, res: Response) => {
    await Token.findOneAndDelete({userId: req.user?.userId})

    res.cookie("refreshToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.cookie("accessToken", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(StatusCodes.OK).json({msg: "user logged out!"})
}

export {register, logout, login}
