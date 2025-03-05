import express from "express"
import authenticateUser from "../middleware/authenticateUser"
import {createComment, deleteComment, getComments} from "../controllers/comment.controller"

const router = express.Router()

router.route("/pin").post(authenticateUser, createComment)

router.route("/:id/pin").get(authenticateUser, getComments).delete(authenticateUser, deleteComment)

export default router
