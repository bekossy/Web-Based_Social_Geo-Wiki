import {Request, Response} from "express"
import {StatusCodes} from "http-status-codes"

const showCurrentUser = (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({user: req.user})
}

export {showCurrentUser}
