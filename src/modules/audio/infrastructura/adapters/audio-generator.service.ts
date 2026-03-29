import { ConfigService } from '@nestjs/config';
import { GenerateAudioDto } from '../../application/dtos/generate-audio.dto';
import { AudioGeneratorPort } from '../../application/ports/audio-generator.port';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AudioGeneratorError } from 'src/shared/errors/audio-generator.error';
import { PinoLogger } from 'nestjs-pino';
import { DataGenerateMusicDto } from '../../application/dtos/data-generate-music.dto';

@Injectable()
export class AudioGeneratorService implements AudioGeneratorPort {
  private clientElevenLabs: ElevenLabsClient;
  constructor(
    private configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    const apiKey = this.configService.get<string>('ELEVEN_LABS_API_KEY');
    this.clientElevenLabs = new ElevenLabsClient({ apiKey });
  }
  async generateVoice(
    generateAudioDto: GenerateAudioDto,
  ): Promise<Buffer<ArrayBuffer>> {
    try {
      const { idModel, prompt } = generateAudioDto;
      const audio = await this.clientElevenLabs.textToSpeech.convert(idModel, {
        text: prompt,
        voiceSettings: {
          stability: generateAudioDto.stability,
          similarityBoost: generateAudioDto.similarity,
          style: generateAudioDto.exaggeration,
          useSpeakerBoost: generateAudioDto.useSpeakerBoost,
        },
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
      });

      const chunks: Uint8Array[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);
      return audioBuffer;
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to generate audio record',
          userId: generateAudioDto.user,
        },
        'Failed to generate audio record',
      );
      throw new AudioGeneratorError({
        message: 'Audio failed',
        details: 'Failed to generate audio record',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async generateMusic(generateMusicDto: DataGenerateMusicDto): Promise<Buffer<ArrayBuffer>>  {
    try {

      const audioStream = await this.clientElevenLabs.music.compose({
        prompt: generateMusicDto.promptBasedMdFile,
        modelId: 'music_v1', 
        musicLengthMs: generateMusicDto.durationMs, 
        forceInstrumental: generateMusicDto.forceInstrumental
      });

      const chunks: Uint8Array[] = [];

      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }

      const audioBuffer = Buffer.concat(chunks);

      this.logger.info(
        {
          userId: generateMusicDto.user,
          size: audioBuffer.length,
        },
        'Music generated successfully',
      );

      return audioBuffer;
    } catch (error) {
      this.logger.error(
        {
          stack: error instanceof Error ? error.stack : undefined,
          message: 'Failed to generate music via ElevenLabs',
          userId: generateMusicDto.user,
        },
        'Failed to generate music record',
      );

      throw new AudioGeneratorError({
        message: 'Music generation failed',
        details:
          error instanceof Error
            ? error.message
            : 'Unknown error from ElevenLabs API',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
