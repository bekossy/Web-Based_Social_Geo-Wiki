import express from "express"
import authenticateUser from "../middleware/authenticateUser"
import {createMappin, deleteMappin, getAllMappins} from "../controllers/mappin.controller"

const router = express.Router()

router.route("/").get(authenticateUser, getAllMappins).post(authenticateUser, createMappin)
router.route("/:id").delete(authenticateUser, deleteMappin)

export default router
