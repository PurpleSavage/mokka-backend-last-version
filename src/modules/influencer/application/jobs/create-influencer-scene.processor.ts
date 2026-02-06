import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PinoLogger } from 'nestjs-pino';
import { NotifierService } from 'src/notifier/notifier.service';
import { CreateInFluencerSceneUseCase } from '../use-cases/create-influencer-scene.use-case';
import { Job } from 'bullmq';
import { CreateInfluencerSceneDto } from '../dtos/create-influencer-scene.dto';
import { ExtractErrorInfo } from 'src/shared/infrastructure/helpers/ExtractErrorInfo';
import { AppBaseError } from 'src/shared/errors/base.error';
import { StatusQueue } from 'src/shared/infrastructure/enums/status-queue';

@Processor('influencer-scene-queue')
export class CreateInfluencerSceneProcessor extends WorkerHost {
  constructor(
    private readonly createInfluencerSceneUseCase: CreateInFluencerSceneUseCase,
    private readonly notifierService: NotifierService,
    private readonly logger: PinoLogger,
  ) {
    super();
  }
  async process(job: Job<CreateInfluencerSceneDto>): Promise<void> {
    try {
      const createInfluencerSceneDto = job.data;
      const result = await this.createInfluencerSceneUseCase.execute(
        createInfluencerSceneDto,
      );
      this.notifierService.notifyReady(
        createInfluencerSceneDto.user,
        'influencer-snapshot',
        {
          jobId: job.id as string,
          entity: result,
          status: StatusQueue.COMPLETED,
          message: 'Influencer snapshot generated',
        },
      );
    } catch (error) {
      const createinfluencerDto = job.data;
      this.logger.error(
        {
          jobId: job.id,
          userId: createinfluencerDto.user,
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
        'Error generating infleuncer scene',
      );
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string);
      this.notifierService.notifyError(
        createinfluencerDto.user,
        'influencer',
        errorInfo,
      );
      throw error;
    }
  }
}
