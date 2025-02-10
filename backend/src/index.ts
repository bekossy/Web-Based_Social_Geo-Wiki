import {connectDB} from "./db/connectdb"
import "express-async-errors"
import {Request, Response} from "express"
import {config} from "dotenv"
import express from "express"
import {StatusCodes} from "http-status-codes"
config()

const app = express()

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send("<h1>Welcome to my server!</h1>")
})

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URI!)
        app.listen(process.env.PORT, () =>
            console.log(`Server running on port: ${process.env.PORT}`)
        )
    } catch (error) {
        console.error(error)
    }
}

startServer()
