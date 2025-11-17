import { ConfigService } from "@nestjs/config";
import { GenerateAudioDto } from "../../application/dtos/generate-audio.dto";
import { AudioGeneratorPort } from "../../application/ports/audio-generator.port";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import {  HttpStatus, Injectable } from "@nestjs/common";
import { AudioGeneratorError } from "src/shared/errors/audio-generator.error";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class AudioGeneratorService implements AudioGeneratorPort{

    private clientElevenLabs: ElevenLabsClient
    constructor(
        private configService: ConfigService,
        private readonly logger: PinoLogger
    ) {
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
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:'Failed to generate audio record',
                    userId:generateAudioDto.userId
                },
                'Failed to generate audio record'
            )
            throw new AudioGeneratorError(
                {
                    message:'Audio failed',
                    details:'Failed to generate audio record',
                    status:HttpStatus.INTERNAL_SERVER_ERROR
                }
            )
        }
    }
}
