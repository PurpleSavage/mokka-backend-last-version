import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { NotifierService } from 'src/notifier/notifier.service';
import { CreateInfluencerUseCase } from '../use-cases/create-influencer.use-case';
import { AppBaseError } from 'src/shared/errors/base.error';
import { ExtractErrorInfo } from 'src/shared/infrastructure/helpers/ExtractErrorInfo';
import { CreateInfluencerDto } from '../dtos/create-influencer.dto';
import { StatusQueue } from 'src/shared/infrastructure/enums/status-queue';

@Processor('influencer-queue')
export class CreateInfluencerProcessor extends WorkerHost {
  constructor(
    private readonly createInfluencerUseCase: CreateInfluencerUseCase,
    private readonly notifierService: NotifierService,
    private readonly logger: PinoLogger,
  ) {
    super();
  }
  async process(job: Job<CreateInfluencerDto>): Promise<any> {
    try {
        const createInfluencerDto = job.data
        const result = await this.createInfluencerUseCase.execute(createInfluencerDto)
        this.notifierService.notifyReady(createInfluencerDto.user,'influencer',{
          jobId: job.id as string,
          entity: result,
          status: StatusQueue.COMPLETED,
          message: 'influencer generated',
        })
    } catch (error) {
      const createinfluencerDto = job.data
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
        'Error generating infleuncer',
      );
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string);
      this.notifierService.notifyError(createinfluencerDto.user,'influencer',errorInfo)
      throw error;
    }
  }
}
