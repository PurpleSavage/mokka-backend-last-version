import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AudioDocument } from "../schemas/audio.schema";
import { Model } from "mongoose";

import { AudioEntity } from "../../domain/entities/audio.entity";
import { normalizeId } from "src/shared/application/helpers/normalized-obj";
import { AudioRepository } from "../../domain/repositories/audio.repository";
import { GenerateAudioVO } from "../../domain/value-objects/generated-audio.vo";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class AudioCommandService implements AudioRepository{
    constructor(
        @InjectModel('Audio') private readonly audioModel: Model<AudioDocument>,
        private readonly logger: PinoLogger
    ){}
    async saveGeneratedAudio(generatedAudioVo: GenerateAudioVO): Promise<AudioEntity> {
            try {
                const audio = new this.audioModel({
                    user:generatedAudioVo.user,
                    prompt:generatedAudioVo.prompt,
                    urlAudio:generatedAudioVo.urlAudio,
                    nameModelAudio:generatedAudioVo.nameModelAudio,
                    idModel:generatedAudioVo.idModel,
                    speed: generatedAudioVo.speed,
                    stability: generatedAudioVo.stability,
                    similarity: generatedAudioVo.similarity,
                    exaggeration: generatedAudioVo.exaggeration,
                    useSpeakerBoost: generatedAudioVo.useSpeakerBoost
                })
                const savedAudio = await audio.save()
                const audioGenerated = new AudioEntity()
                .setCreateDate(savedAudio.createdAt)
                .setExaggeration(savedAudio.exaggeration)
                .setId(savedAudio._id.toString())
                .setIdModel(savedAudio.idModel)
                .setUser(normalizeId(savedAudio.user))
                .setNameModelAudio(savedAudio.nameModelAudio)
                .setPrompt(savedAudio.prompt)
                .setSimilarity(savedAudio.similarity)
                .setSpeed(savedAudio.speed)
                .setStability(savedAudio.stability)
                .setUrlAudio(savedAudio.urlAudio)
                .setUseSpeakerBoost(savedAudio.useSpeakerBoost)
                .build()
                return audioGenerated
            } catch (error) {
                this.logger.error(
                    {
                        stack: error instanceof Error ? error.stack : undefined,
                        message:'Failed to generate audio record',
                        userId:generatedAudioVo.user
                    },
                    'Failed to generate audio record'
                )
                throw new MokkaError({
                    message: 'Database operation failed',
                    errorType: ErrorPlatformMokka.DATABASE_FAILED,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    details: 'Failed to save audio record'
                })
            }
        }
}