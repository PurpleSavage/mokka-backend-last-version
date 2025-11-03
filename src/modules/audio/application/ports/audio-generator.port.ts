import { GenerateAudioDto } from "../dtos/generate-audio.dto";

export abstract class AudioGeneratorPort{
     abstract generateVoice(generateAudioDto:GenerateAudioDto):Promise< Buffer<ArrayBuffer>>
}