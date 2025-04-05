import {type Document, model, Schema} from "mongoose"

interface IBookmarkSchema extends Document {
    mapboxId: string
    userId: string
    latitude: number
    longitude: number
}

const BookmarkSchema = new Schema(
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
    },
    {
        timestamps: true,
    }
)

export default model<IBookmarkSchema>("Bookmark", BookmarkSchema)
