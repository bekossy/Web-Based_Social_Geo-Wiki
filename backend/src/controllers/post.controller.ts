import {StatusCodes} from "http-status-codes"
import Post from "../models/post.model"
import Mappin from "../models/mappin.model"
import {Request, Response} from "express"
import {BadRequestError, NotFoundError} from "../errors"

import cloudinary from "cloudinary"
import fs from "fs"
import {env} from "../lib/env"

cloudinary.v2.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
})

const uploadToCloudinary = async (filePath: string) => {
    const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: "web-based_social_geo-wiki",
    })
    fs.unlinkSync(filePath)
    return result.secure_url
}

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
    if (!mappin) throw new NotFoundError(`Mappin with id ${mappinId} not found`)

    let imagePaths: string[] = []
    if (Array.isArray(req.files) && req.files.length > 0) {
        if (req.files.length > 4) {
            throw new BadRequestError("Cannot upload more than 4 images")
        }

        for (const file of req.files as Express.Multer.File[]) {
            const imageUrl = await uploadToCloudinary(file.path)
            imagePaths.push(imageUrl)
        }
    }

    const post = await Post.create({...req.body, images: imagePaths})
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
