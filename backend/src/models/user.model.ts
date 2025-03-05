import mongoose from "mongoose"
import bcrypt from "bcryptjs"

interface IUser extends Document {
    username: string
    password: string
    comparePassword(customerPassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide a username"],
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 3,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 6,
        },
    },
    {timestamps: true}
)

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return
    const salt = await bcrypt.genSalt(15)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.methods.comparePassword = async function (customerPassword: string) {
    const isPasswordCorrect = await bcrypt.compare(customerPassword, this.password)

    return isPasswordCorrect
}

export default mongoose.model<IUser>("User", UserSchema)
