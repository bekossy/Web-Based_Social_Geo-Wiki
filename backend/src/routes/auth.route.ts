import express from "express"
import {register, logout, login} from "../controllers/auth.controller"
import authenticateUser from "../middleware/authenticateUser"
const router = express.Router()

router.post("/signup", register)
router.post("/signin", login)
router.get("/signout", authenticateUser, logout)

export default router
