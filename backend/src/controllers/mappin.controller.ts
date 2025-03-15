import {Request, Response} from "express"
import {StatusCodes} from "http-status-codes"
import Mappin from "../models/mappin.model"
import {NotFoundError} from "../errors"

const getAllMappins = async (req: Request, res: Response) => {
    const mappins = await Mappin.find().populate({
        path: "userId",
        select: ["username", "createdAt", "color"],
    })
    res.status(StatusCodes.OK).json({mappins})
}

const createMappin = async (req: Request, res: Response) => {
    req.body.userId = req.user?.userId
    const mappin = await Mappin.create(req.body)
    res.status(StatusCodes.CREATED).json({mappin})
}

const deleteMappin = async (req: Request, res: Response) => {
    const {id: mappinId} = req.params
    const mappin = await Mappin.findById(mappinId)

    if (!mappin) {
        throw new NotFoundError(`Mappin with id ${mappinId} not found`)
    }

    await mappin.deleteOne()
    res.status(StatusCodes.OK).json({message: "Mappin deleted successfully"})
}

export {getAllMappins, createMappin, deleteMappin}
