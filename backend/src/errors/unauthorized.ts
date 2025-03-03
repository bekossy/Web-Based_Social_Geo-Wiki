import {CustomAPIError} from "./custom-api"
import {StatusCodes} from "http-status-codes"

class UnauthorizedError extends CustomAPIError {
    statusCode: StatusCodes.FORBIDDEN
    constructor(message: string) {
        super(message)
        this.statusCode = StatusCodes.FORBIDDEN
    }
}

export default UnauthorizedError
