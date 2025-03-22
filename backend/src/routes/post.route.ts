import express from "express"
import authenticateUser from "../middleware/authenticateUser"
import {createPost, deletePost, getPosts} from "../controllers/post.controller"
import upload from "../middleware/upload"

const router = express.Router()

router.route("/pin").post(authenticateUser, upload, createPost)

router.route("/:id/pin").get(authenticateUser, getPosts).delete(authenticateUser, deletePost)

export default router
