import {Document, Schema, model} from "mongoose"

interface IPostSchema extends Document {
    userId: Schema.Types.ObjectId
    mappinId: Schema.Types.ObjectId
    content: string
    images: {
        url: String
        public_id: String
    }[]
    reports: string[]
}

const PostSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mappinId: {
            type: Schema.Types.ObjectId,
            ref: "Mappin",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        images: {
            type: [
                {
                    url: String,
                    public_id: String,
                },
            ],
            validate: [(val: string[]) => val.length <= 4, "Cannot upload more than 4 images"],
            default: [],
        },
        reports: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
    },
    {timestamps: true},
)

export default model<IPostSchema>("Post", PostSchema)
