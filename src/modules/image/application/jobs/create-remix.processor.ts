import { Processor, WorkerHost } from '@nestjs/bullmq';
import { NotifierService } from 'src/notifier/notifier.service';

import { PinoLogger } from 'nestjs-pino';
import { AppBaseError } from 'src/shared/errors/base.error';
import { Job } from 'bullmq';
import { StatusQueue } from 'src/shared/infrastructure/enums/status-queue';
import { ExtractErrorInfo } from 'src/shared/infrastructure/helpers/ExtractErrorInfo';
import { CreateRemixImageUseCase } from '../use-cases/create-remix-image.use-case';
import { CreateRemixImageDto } from '../dtos/create-remix-image.dto';

@Processor('remix-image-queue')
export class RemixImageProcessor extends WorkerHost {
  constructor(
    private readonly createRemixImageUseCase: CreateRemixImageUseCase,
    private readonly imageNotifierService: NotifierService,
    private readonly logger: PinoLogger,
  ) {
    super();
  }
  async process(job: Job<CreateRemixImageDto>) {
    try {
      const createRemixImageDto = job.data;
      const result = await this.createRemixImageUseCase.execute(createRemixImageDto);
      this.imageNotifierService.notifyImageReady(createRemixImageDto.user, {
        jobId: job.id as string,
        entity: result,
        status: StatusQueue.COMPLETED,
        message: 'Image generated',
      });
    } catch (error) {
      const createRemixImageDto = job.data;
      this.logger.error(
        {
          jobId: job.id,
          userId: createRemixImageDto.user,
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
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string);
      this.imageNotifierService.notifyAudioError(
        createRemixImageDto.user,
        errorInfo,
      );
      throw error;
    }
  }
}