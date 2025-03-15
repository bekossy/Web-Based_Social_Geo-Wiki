import mongoose from "mongoose"

interface IPostSchema extends Document {
    userId: mongoose.Schema.Types.ObjectId
    mappinId: mongoose.Schema.Types.ObjectId
    content: string
}

const PostSchema = new mongoose.Schema(
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
        content: {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
)

export default mongoose.model<IPostSchema>("Post", PostSchema)
