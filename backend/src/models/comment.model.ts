import mongoose from "mongoose"

interface ICommentSchema extends Document {
    userId: mongoose.Schema.Types.ObjectId
    mappinId: mongoose.Schema.Types.ObjectId
    title: string
    description: string
    rating: number
}

const CommentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mappinId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mappin",
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

export default mongoose.model<ICommentSchema>("Comment", CommentSchema)
