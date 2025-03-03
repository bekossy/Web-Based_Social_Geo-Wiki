import {Request} from "express"

declare module "express" {
    export interface Request {
        user?: User
    }
}

interface User {
    userId: string
    username: string
}
