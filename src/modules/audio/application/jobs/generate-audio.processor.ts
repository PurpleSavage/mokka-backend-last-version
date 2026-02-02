import { Processor, WorkerHost } from '@nestjs/bullmq';
import { NotifierService } from 'src/notifier/notifier.service';
import { GenerateAudioUseCase } from '../use-cases/generate-audio.use-case';
import { GenerateAudioDto } from '../dtos/generate-audio.dto';
import { Job } from 'bullmq';
import { AppBaseError } from 'src/shared/errors/base.error';
import { PinoLogger } from 'nestjs-pino';
import { StatusQueue } from 'src/shared/infrastructure/enums/status-queue';
import { ExtractErrorInfo } from 'src/shared/infrastructure/helpers/ExtractErrorInfo';

@Processor('audio-queue')
export class AudioProcessor extends WorkerHost {
  constructor(
    private readonly generateAudioUseCase: GenerateAudioUseCase,
    private readonly notifierService: NotifierService,
    private readonly logger: PinoLogger,
  ) {
    super();
  }
  async process(job: Job<GenerateAudioDto>): Promise<any> {
    try {
      const generateAudioDto = job.data;
      const result = await this.generateAudioUseCase.execute(generateAudioDto)
      this.notifierService.notifyReady(generateAudioDto.user,'audio',{
          jobId: job.id as string,
          entity: result,
          status: StatusQueue.COMPLETED,
          message: 'Audio generated',
        })
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
      this.notifierService.notifyError( generateAudioDto.user,'audio',errorInfo)
      throw error
    }
  }
}
