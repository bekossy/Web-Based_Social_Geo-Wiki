import "express-async-errors"
import {env} from "./lib/env"
import {connectDB} from "./db/connectdb"
import {Request, Response} from "express"
import express from "express"
import {StatusCodes} from "http-status-codes"
import errorHandlerMiddleware from "./middleware/error-handler"
import notFoundMiddleware from "./middleware/not-found"
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize"
import cors from "cors"
import helmet from "helmet"

import authRouter from "./routes/auth.route"
import userRouter from "./routes/user.route"
import mappinRouter from "./routes/mappin.route"
import postRouter from "./routes/post.route"
import bookmarkRouter from "./routes/bookmark.route"

const app = express()

app.use(express.static("./public"))
app.use(express.json())
app.use(helmet())
app.use(
    cors({
        origin: env.WEB_APP_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Set-Cookie"],
    }),
)

app.use(cookieParser(env.JWT_SECRET))
app.use(mongoSanitize())

app.get("/", (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send("<h1>Welcome to my server!</h1>")
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/mappin", mappinRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/bookmark", bookmarkRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const startServer = async () => {
    try {
        await connectDB(env.MONGO_URI)
        app.listen(process.env.PORT, () => console.log(`Server running on port: ${env.PORT}`))
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

startServer()
