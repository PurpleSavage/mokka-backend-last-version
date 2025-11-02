import { AudioEntity } from "../entities/audio.entity";
import { GenerateAudioVO } from "../value-objects/generated-audio.vo";

export abstract class AudioRepository{
    abstract saveGeneratedAudio(generatedAudioVo:GenerateAudioVO):Promise<AudioEntity>
}