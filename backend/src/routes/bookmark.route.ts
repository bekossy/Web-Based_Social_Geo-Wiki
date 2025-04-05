import express from "express"
import authenticateUser from "../middleware/authenticateUser"
import {getUserBookmarks, createBookmark, deleteBookmark} from "../controllers/bookmark.controller"

const router = express.Router()

router.route("/").get(authenticateUser, getUserBookmarks).post(authenticateUser, createBookmark)
router.route("/:id").delete(authenticateUser, deleteBookmark)

export default router
