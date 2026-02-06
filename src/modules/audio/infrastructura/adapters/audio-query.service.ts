import { HttpStatus, Injectable } from "@nestjs/common";
import { AudioEntity } from "../../domain/entities/audio.entity";
import { AudioDocument } from "../schemas/audio.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { normalizeId } from "src/shared/application/helpers/normalized-obj";
import { AudioPort } from "../../application/ports/audio.port";
import { MokkaError } from "src/shared/errors/mokka.error";
import { PinoLogger } from "nestjs-pino";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";

@Injectable()
export class AudioQueryService implements AudioPort{
    constructor(
        @InjectModel('Audio') private readonly audioModel: Model<AudioDocument>,
        private readonly logger: PinoLogger
    ){}
    async listAudios(userId: string): Promise<AudioEntity[]> {
        try {
            const audios = await this.audioModel.find({
                userId
            }).exec()
             return audios.map((audio) =>
                new AudioEntity()
                .setId(audio._id.toString())
                .setUser(normalizeId(audio.user))
                .setPrompt(audio.prompt)
                .setCreateDate(audio.createdAt)
                .setUrlAudio(audio.urlAudio)
                .setIdModel(audio.idModel)
                .setNameModelAudio(audio.nameModelAudio)
                .setSpeed(audio.speed)
                .setStability(audio.stability)
                .setSimilarity(audio.similarity)
                .setExaggeration(audio.exaggeration)
                .setUseSpeakerBoost(audio.useSpeakerBoost)
                .build()
            )
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:'Failed to list audios',
                    userId
                },
                'Failed to list audios'
            )
            throw new MokkaError({
                message: 'Database operation failed',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Failed to list audios'
            })
        }
    }
}