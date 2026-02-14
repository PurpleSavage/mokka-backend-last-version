import { InjectModel } from "@nestjs/mongoose";
import { TextPort } from "../../application/ports/text.port";
import { TextEntity } from "../../domain/entities/text.entity";
import { Model } from "mongoose";
import { TextDocument } from "../schemas/text.schema";
import { PinoLogger } from "nestjs-pino";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";
import { HttpStatus, Injectable } from "@nestjs/common";
import { MokkaError } from "src/shared/errors/mokka.error";

@Injectable()
export class TextQueryService implements TextPort{
    constructor(
        @InjectModel('Text') private readonly textModel: Model<TextDocument>,
        private readonly logger: PinoLogger
    ){}
    async listTexts(user: string): Promise<TextEntity[]> {
       
        try {
            const texts = await this.textModel.find({
                user
            }).exec()
            console.log('textos',texts)
            return texts.map((text)=>{
                return new TextEntity()
                .setId(text._id.toString())
                .setContext(text.context)
                .setPromotionType(text.promotionType)
                .setTitle(text.title)
                .setToneType(text.toneType)
                .setTextLength(text.textLength)
                .setTextFormat(text.textFormat)
                .setImprovedContext(text.improvedContext)
                .setCreateDate(text.createdAt)
            })
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error to list history texts"
                },
                'Error saving image'
            )
            throw new MokkaError({
                message: 'Failed to listo history text',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
}