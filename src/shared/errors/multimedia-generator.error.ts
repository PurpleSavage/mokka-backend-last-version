import { HttpStatus } from "@nestjs/common";
import { AppBaseError } from "./base.error"
import { MultimediaErrorTypes } from "../infrastructure/enums/error-detail-types";

export class MultimediaGeneratorError extends AppBaseError{ 
    constructor(message: string, details?:MultimediaErrorTypes, status: HttpStatus = HttpStatus.BAD_REQUEST) {
        super(message, 'REPLICATE_ERROR', status, details);
    }
}
export type ReplicateError = Error | { error?: string; message?: string; status?: string }