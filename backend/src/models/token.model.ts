import mongoose from "mongoose"

interface IToken extends Document {
    refreshToken: string
    userId: mongoose.Schema.Types.ObjectId
    isValid: boolean
}

const TokenSchema = new mongoose.Schema(
    {
        refreshToken: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User",
        },
        isValid: {
            type: Boolean,
            default: true,
        },
    },
    {timestamps: true},
)

export default mongoose.model<IToken>("Token", TokenSchema)
