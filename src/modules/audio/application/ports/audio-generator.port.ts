import { DatagenerateMusciDto } from "../dtos/data-generate-music.dto";
import { GenerateAudioDto } from "../dtos/generate-audio.dto";


export abstract class AudioGeneratorPort{
     abstract generateVoice(generateAudioDto:GenerateAudioDto):Promise< Buffer<ArrayBuffer>>

     abstract generateMusic(generateMusicDto:DatagenerateMusciDto):Promise< Buffer<ArrayBuffer>>
}