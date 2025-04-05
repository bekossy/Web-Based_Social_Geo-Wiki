import {type Document, model, Schema} from "mongoose"
import Posts from "./post.model"

interface IMapPinSchema extends Document {
    mapboxId: string
    userId: string
    latitude: number
    longitude: number
}

const MapPinSchema = new Schema(
    {
        mapboxId: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        latitude: {
            type: Number,
            required: true,
        },
        longitude: {
            type: Number,
            required: true,
        },
    },
    {timestamps: true}
)

MapPinSchema.pre("deleteOne", async function (next) {
    const mappin = await this.model.findOne(this.getQuery())
    if (mappin) {
        await Posts.deleteMany({mappinId: mappin._id})
    }
    next()
})

export default model<IMapPinSchema>("MapPin", MapPinSchema)
