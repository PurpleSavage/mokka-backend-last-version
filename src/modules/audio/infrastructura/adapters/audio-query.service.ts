import { HttpStatus, Injectable } from "@nestjs/common";
import { AudioEntity } from "../../domain/entities/audio.entity";
import { AudioDocument } from "../schemas/audio.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { normalizeId } from "src/shared/application/helpers/normalized-obj";
import { AudioPort } from "../../application/ports/audio.port";
import { MokkaError } from "src/shared/errors/mokka.error";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class AudioQueryService implements AudioPort{
    constructor(
        @InjectModel('Audio') private readonly audioModel: Model<AudioDocument>,
        private readonly logger: PinoLogger
    ){}
    async listAudios(idUser: string): Promise<AudioEntity[]> {
        try {
            const audios = await this.audioModel.find({
                idUser
            }).exec()
             return audios.map((audio) =>
                new AudioEntity()
                .setId(audio._id.toString())
                .setIdUser(normalizeId(audio.user))
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
            console.log(error)
            throw new MokkaError(
                'Failed to save audio record',
                'Database operation failed',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}