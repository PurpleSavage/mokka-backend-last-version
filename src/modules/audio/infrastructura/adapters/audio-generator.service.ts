import { ConfigService } from "@nestjs/config";
import { GenerateAudioDto } from "../../application/dtos/generate-audio.dto";
import { AudioGeneratorPort } from "../../application/ports/audio-generator.port";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { HttpException, HttpStatus } from "@nestjs/common";
export class AudioGeneratorService implements AudioGeneratorPort{

    private clientElevenLabs: ElevenLabsClient
    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('ELEVEN_LABS_API_KEY')
        this.clientElevenLabs = new ElevenLabsClient({ apiKey })
    }
    async generateVoice(generateAudioDto:GenerateAudioDto):Promise< Buffer<ArrayBuffer>> {
        try {
            const {idModel,prompt}=generateAudioDto
            const audio = await this.clientElevenLabs.textToSpeech.convert(idModel,{
                text: prompt,
                voiceSettings:{
                    stability: generateAudioDto.stability,
                    similarityBoost: generateAudioDto.similarity,
                    style: generateAudioDto.exaggeration,
                    useSpeakerBoost: generateAudioDto.useSpeakerBoost,
                },
                modelId: 'eleven_multilingual_v2',
                outputFormat: 'mp3_44100_128',
            })

            const chunks: Uint8Array[] = [];
            for await (const chunk of audio) {
                chunks.push(chunk);
            }
            const audioBuffer = Buffer.concat(chunks);
            return audioBuffer
        } catch (error) {
            console.log(error)
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error:'Invalid credentials',
                errorType:'ElevenLabs_ERROR'
            },HttpStatus.CONFLICT)}
    }
}
