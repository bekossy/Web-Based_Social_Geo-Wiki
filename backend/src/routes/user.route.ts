import express from "express"
import {showCurrentUser} from "../controllers/user.controller"
import authenticateUser from "../middleware/authenticateUser"

const router = express.Router()

router.route("/showCurrentUser").get(authenticateUser, showCurrentUser)

export default router
