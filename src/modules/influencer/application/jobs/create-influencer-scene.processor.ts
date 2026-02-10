import { Processor, WorkerHost } from '@nestjs/bullmq';
import { PinoLogger } from 'nestjs-pino';
import { JobsType, NotifierService } from 'src/notifier/notifier.service';
import { CreateInFluencerSceneUseCase } from '../use-cases/create-influencer-scene.use-case';
import { Job } from 'bullmq';
import { CreateInfluencerSceneDto } from '../dtos/create-influencer-scene.dto';
import { ExtractErrorInfo } from 'src/shared/infrastructure/helpers/ExtractErrorInfo';
import { AppBaseError } from 'src/shared/errors/base.error';
import { StatusQueue } from 'src/shared/infrastructure/enums/status-queue';
import { CreditLogicRepository } from 'src/shared/domain/repositories/credits-logic.repository';


@Processor('influencer-scene-queue')
export class CreateInfluencerSceneProcessor extends WorkerHost {
  constructor(
    private readonly createInfluencerSceneUseCase: CreateInFluencerSceneUseCase,
    private readonly notifierService: NotifierService,
    private readonly creditsService: CreditLogicRepository,
    private readonly logger: PinoLogger,
  ) {
    super();
  }
  async process(job: Job<CreateInfluencerSceneDto>): Promise<void> {
    try {
      const createInfluencerSceneDto = job.data;
      const result = await this.createInfluencerSceneUseCase.execute(
        createInfluencerSceneDto,
      )
      
      const creditsUpdated= await this.creditsService.decreaseCredits(30,createInfluencerSceneDto.user) 
         
      this.notifierService.notifyReady(
        createInfluencerSceneDto.user,
        JobsType.INFLUENCER_SCENE,
        {
          jobId: job.id as string,
          entity: result,
          status: StatusQueue.COMPLETED,
          message: 'Influencer snapshot generated',
          creditsUpdate:creditsUpdated
        },
      )
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
        'Error generating infleuncer scene',
      )
      const errorInfo = ExtractErrorInfo.extract(error, job.id as string)

      this.notifierService.notifyError(
        createinfluencerDto.user,
        JobsType.INFLUENCER_SCENE,
        errorInfo,
      )

      throw error
    }
  }
}
