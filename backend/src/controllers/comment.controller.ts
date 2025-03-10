import {StatusCodes} from "http-status-codes"
import Comment from "../models/comment.model"
import Mappin from "../models/mappin.model"
import {Request, Response} from "express"
import {NotFoundError} from "../errors"

const getComments = async (req: Request, res: Response) => {
    const {id: mappinId} = req.params
    const comments = await Comment.find({mappinId}).populate({
        path: "userId",
        select: ["username", "createdAt"],
    })
    res.status(StatusCodes.OK).json({comments})
}

const createComment = async (req: Request, res: Response) => {
    req.body.userId = req.user?.userId
    const {mappinId} = req.body

    const mappin = await Mappin.findById(mappinId)

    if (!mappin) {
        throw new NotFoundError(`Mappin with id ${mappinId} not found`)
    }

    const comment = await Comment.create(req.body)
    res.status(StatusCodes.CREATED).json({comment})
}

const deleteComment = async (req: Request, res: Response) => {
    const {id: commentId} = req.params

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new NotFoundError(`Comment with id ${commentId} not found`)
    }

    await comment.deleteOne()
    res.status(StatusCodes.OK).json({message: "Comment deleted successfully"})
}

export {getComments, createComment, deleteComment}
