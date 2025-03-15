import mongoose from "mongoose"

interface ICommentSchema extends Document {
    userId: mongoose.Schema.Types.ObjectId
    mappinId: mongoose.Schema.Types.ObjectId
    comment: string
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
        comment: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
)

export default mongoose.model<ICommentSchema>("Comment", CommentSchema)
