import {config} from "dotenv"
config()
import zod from "zod"

const envSchema = zod.object({
    MONGO_URI: zod.string().min(1),
    PORT: zod.string().min(1),
    JWT_SECRET: zod.string().min(1),
    WEB_APP_URL: zod.string().min(1),
})

export const env = envSchema.parse(process.env)
