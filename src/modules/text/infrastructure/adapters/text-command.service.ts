
import { InjectModel } from "@nestjs/mongoose";
import { TextEntity } from "../../domain/entities/text.entity";
import { TextRepository } from "../../domain/repositories/text.repository";
import { GenerateTextVO } from "../../domain/value-objects/generate-text.vo";
import { Model } from "mongoose";
import { TextDocument } from "../schemas/text.schema";
import { PinoLogger } from "nestjs-pino";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";
import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class TextCommandService implements TextRepository{
    constructor(
        @InjectModel('Text') private readonly textModel: Model<TextDocument>,
        private readonly logger: PinoLogger
    ){}
    async saveText(generateTextVO: GenerateTextVO): Promise<TextEntity> {
        try {
            const text = new this.textModel({
                user:generateTextVO.user,
                context:generateTextVO.context,
                promotionType:generateTextVO.promotionType,
                title:generateTextVO.title,
                toneType:generateTextVO.toneType,
                textLength:generateTextVO.textLength,
                textFormat:generateTextVO.textFormat,
                improvedContext:generateTextVO.improvedContext
            })
            const savedText = await text.save()
            return new TextEntity()
            .setId(savedText._id.toString())
            .setContext(savedText.context)
            .setPromotionType(savedText.promotionType)
            .setTitle(savedText.title)
            .setToneType(savedText.toneType)
            .setTextLength(savedText.textLength)
            .setTextFormat(savedText.textFormat)
            .setImprovedContext(savedText.improvedContext)
            .setCreateDate(savedText.createdAt)
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error to save generate text"
                },
                'Error saving image'
            )
            throw new MokkaError({
                message: 'Failed to save generate text',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
}