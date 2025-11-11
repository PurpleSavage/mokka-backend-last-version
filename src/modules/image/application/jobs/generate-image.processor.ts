import { Processor, WorkerHost } from '@nestjs/bullmq';
import { NotifierService } from 'src/notifier/notifier.service';
import { GenerateImageUseCase } from '../use-cases/generate-image.use-case';
import { GenerateImageDto } from '../dtos/generate-image.dto';
import { PinoLogger } from 'nestjs-pino';
import { AppBaseError } from 'src/shared/errors/base.error';
import { Job } from 'bullmq';

@Processor('image-queue')
export class ImageProcessor extends WorkerHost {
  constructor(
    private readonly generateImageUseCase: GenerateImageUseCase,
    private readonly imageNotifierService: NotifierService,
    private readonly logger: PinoLogger,
  ) {
    super();
  }
  async process(job: Job<GenerateImageDto>) {
    try {
        const generateImageDto = job.data
        const result = await this.generateImageUseCase.execute(generateImageDto)
        this.imageNotifierService.notifyImageReady(
                generateImageDto.userId,{
                    jobId:job.id as string,
                    entity:result,
                    status:'completed',
                    message:'Image generated'
                }

            )
    } catch (error) {
      const generateImageDto = job.data;
      this.logger.error(
        {
          jobId: job.id,
          userId: generateImageDto.userId,
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
      const errorMessage =
        error instanceof AppBaseError
          ? error.message
          : 'Unexpected error occurred to generate audio';
      this.imageNotifierService.notifyImageError(generateImageDto.userId, {
        jobId: job.id as string,
        status: 'failed',
        error: errorMessage,
      });
      throw error;
    }
  }
}
