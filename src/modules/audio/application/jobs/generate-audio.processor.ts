import { Processor, WorkerHost } from '@nestjs/bullmq';
import { GenerateAudioUseCase } from '../use-cases/generate-audio.use-case';
import { GenerateAudioDto } from '../dtos/generate-audio.dto';
import { Job } from 'bullmq';
import { AppBaseError } from 'src/shared/errors/base.error';
import { PinoLogger } from 'nestjs-pino';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExtractErrorInfo } from 'src/shared/common/infrastructure/helpers/ExtractErrorInfo';
import { JobsType, NotifierService } from 'src/shared/notifications/infrastructure/sockets/notifier.service';

@Processor('audio-queue')
export class AudioProcessor extends WorkerHost {
  constructor(
    private readonly generateAudioUseCase: GenerateAudioUseCase,
    private readonly notifierService: NotifierService,
    private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2
  ) {
    super();
  }
  async process(job: Job<GenerateAudioDto>) {
    try {
      const generateAudioDto = job.data;
      
      this.logger.info({ jobId: job.id, dto: generateAudioDto }, '🎵 [AudioProcessor] Job recibido')
      const result = await this.generateAudioUseCase.execute(generateAudioDto)
      this.logger.info({ jobId: job.id, result }, '✅ [AudioProcessor] Resultado del servicio')
      this.eventEmitter.emit('video.processing.completed', {
        payload: generateAudioDto,
        audioBuffer: result, 
        jobId: job.id
      });
    } catch (error) {
      const generateAudioDto = job.data;
      this.logger.error(
        {
          jobId: job.id,
          userId: generateAudioDto.user,
          errorType:
            error instanceof AppBaseError ? error.errorType : 'UNKNOWN_ERROR',
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
          errorDetails:
            error instanceof AppBaseError ? error.details : undefined,
          httpStatus:
            error instanceof AppBaseError ? error.getStatus() : undefined,
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error generating audio',
      );
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string)
      this.notifierService.notifyError( generateAudioDto.user,JobsType.AUDIO,errorInfo)
      throw error
    }
  }
}
