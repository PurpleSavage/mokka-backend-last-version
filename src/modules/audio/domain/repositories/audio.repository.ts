import type{ AudioEntity } from "../entities/audio.entity";
import type{ GenerateAudioVO } from "../value-objects/generated-audio.vo";

export abstract class AudioRepository{
    abstract saveGeneratedAudio(generatedAudioVo:GenerateAudioVO):Promise<AudioEntity>
}