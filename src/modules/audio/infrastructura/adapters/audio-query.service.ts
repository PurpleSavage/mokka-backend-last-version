import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AudioRepository } from "../../domain/repositories/audio.repository";
import { AudioEntity } from "../../domain/entities/audio.entity";
import { GenerateAudioVO } from "../../domain/value-objects/generated-audio.vo";
import { AudioDocument } from "../schemas/audio.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { normalizeId } from "src/shared/application/helpers/normalized-obj";

@Injectable()
export class AudioQueryService implements AudioRepository{
    constructor(
        @InjectModel('Audio') private readonly audioModel: Model<AudioDocument>
    ){}
    async saveGeneratedAudio(generatedAudioVo: GenerateAudioVO): Promise<AudioEntity> {
        try {
            const audio = new this.audioModel({
                idUser:generatedAudioVo.idUser,
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
            .setIdUser(normalizeId(savedAudio.idUser))
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
            console.log(error)
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error:'Invalid credentials',
                errorType:'Mokka_ERROR'
            },HttpStatus.CONFLICT)
        }
    }
}