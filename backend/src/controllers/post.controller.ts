import {StatusCodes} from "http-status-codes"
import Post from "../models/post.model"
import Mappin from "../models/mappin.model"
import {Request, Response} from "express"
import {NotFoundError} from "../errors"

const getPosts = async (req: Request, res: Response) => {
    const {id: mappinId} = req.params
    const posts = await Post.find({mappinId}).populate({
        path: "userId",
        select: ["username", "createdAt", "color"],
    })
    res.status(StatusCodes.OK).json({posts})
}

const createPost = async (req: Request, res: Response) => {
    req.body.userId = req.user?.userId
    const {mappinId} = req.body

    const mappin = await Mappin.findById(mappinId)

    if (!mappin) {
        throw new NotFoundError(`Mappin with id ${mappinId} not found`)
    }

    const post = await Post.create(req.body)
    res.status(StatusCodes.CREATED).json({post})
}

const deletePost = async (req: Request, res: Response) => {
    const {id: postId} = req.params

    const post = await Post.findById(postId)

    if (!post) {
        throw new NotFoundError(`Post with id ${postId} not found`)
    }

    await post.deleteOne()
    res.status(StatusCodes.OK).json({message: "Post deleted successfully"})
}

export {getPosts, createPost, deletePost}
