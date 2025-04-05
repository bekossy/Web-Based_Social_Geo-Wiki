import {Request, Response} from "express"
import {StatusCodes} from "http-status-codes"
import Bookmark from "../models/bookmark.model"
import {BadRequestError, NotFoundError} from "../errors"

const getUserBookmarks = async (req: Request, res: Response) => {
    const bookmarks = await Bookmark.find({userId: req.user?.userId})
    res.status(StatusCodes.OK).json({bookmarks})
}

const createBookmark = async (req: Request, res: Response) => {
    req.body.userId = req.user?.userId
    const {userId, mappinId} = req.body

    const existingBookmark = await Bookmark.findOne({userId, mappinId})
    if (existingBookmark) {
        throw new BadRequestError("Bookmark for this place already exists")
    }

    const bookmark = await Bookmark.create(req.body)
    res.status(StatusCodes.CREATED).json({bookmark})
}

const deleteBookmark = async (req: Request, res: Response) => {
    const {id: bookmarkId} = req.params
    const bookmark = await Bookmark.findById(bookmarkId)

    if (!bookmark) {
        throw new NotFoundError(`Bookmark with id ${bookmarkId} not found`)
    }

    await bookmark.deleteOne()
    res.status(StatusCodes.OK).json({message: "Bookmark deleted successfully"})
}

export {getUserBookmarks, createBookmark, deleteBookmark}
