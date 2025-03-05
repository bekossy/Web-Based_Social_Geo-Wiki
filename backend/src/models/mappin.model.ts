import mongoose from "mongoose"

interface ICommentSchema extends Document {
    userId: mongoose.Schema.Types.ObjectId
    title: string
    description: string
    rating: number
}

const CommentSchema = new mongoose.Schema<ICommentSchema>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    {timestamps: true}
)

interface IMapPinSchema extends Document {
    mapboxId: string
    userId: string
    latitude: number
    longitude: number
}

const MapPinSchema = new mongoose.Schema(
    {
        mapboxId: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model<IMapPinSchema>("MapPin", MapPinSchema)
