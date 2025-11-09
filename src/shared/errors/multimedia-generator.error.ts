import { HttpStatus } from "@nestjs/common";
import { AppBaseError } from "./base.error"

export class MultimediaGeneratorError extends AppBaseError{ 
    constructor(message: string, details?: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
        super(message, 'REPLICATE_ERROR', status, details);
    }
}