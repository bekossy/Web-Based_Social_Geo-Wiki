import {StatusCodes} from "http-status-codes"
import {CustomAPIError} from "./custom-api"

export class InternalServerError extends CustomAPIError {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    constructor(message: string) {
        super(message)
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }
}
