import { Processor, WorkerHost } from '@nestjs/bullmq';
import { NotifierService } from 'src/notifier/notifier.service';
import { GenerateImageUseCase } from '../use-cases/generate-image.use-case';
import { GenerateImageDto } from '../dtos/generate-image.dto';
import { PinoLogger } from 'nestjs-pino';
import { AppBaseError } from 'src/shared/errors/base.error';
import { Job } from 'bullmq';
import { StatusQueue } from 'src/shared/infrastructure/enums/status-queue';
import { ExtractErrorInfo } from 'src/shared/infrastructure/helpers/ExtractErrorInfo';

@Processor('image-queue')
export class ImageProcessor extends WorkerHost {
  constructor(
    private readonly generateImageUseCase: GenerateImageUseCase,
    private readonly imageNotifierService: NotifierService,
    private readonly logger: PinoLogger,
  ) {
    super();
  }
  async process(job: Job<GenerateImageDto>):Promise<void> {
    try {
      const generateImageDto = job.data;
      const result = await this.generateImageUseCase.execute(generateImageDto);
      this.imageNotifierService.notifyImageReady(generateImageDto.user, {
        jobId: job.id as string,
        entity: result,
        status: StatusQueue.COMPLETED,
        message: 'Image generated',
      });
    } catch (error) {
      const generateImageDto = job.data;
      this.logger.error(
        {
          jobId: job.id,
          userId: generateImageDto.user,
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
      )
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string);
      this.imageNotifierService.notifyImageError(
        generateImageDto.user,
        errorInfo,
      )
      throw error
    }
  }
}
