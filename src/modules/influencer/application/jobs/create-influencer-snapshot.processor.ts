import { Processor, WorkerHost } from "@nestjs/bullmq";
import { PinoLogger } from "nestjs-pino";
import { JobsType, NotifierService } from "src/notifier/notifier.service";
import { CreateInfluencerSnapshotUseCase } from "../use-cases/create-influencer-snapshot.use-case";
import { Job } from "bullmq";
import { CreateInfluencerSnapshotDto } from "../dtos/create-influencer-snapshot.dto";
import { ExtractErrorInfo } from "src/shared/infrastructure/helpers/ExtractErrorInfo";
import { AppBaseError } from "src/shared/errors/base.error";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { CreditLogicRepository } from "src/shared/domain/repositories/credits-logic.repository";
@Processor('influencer-snapshot-queue')
export class CreateInfluencerSnapshotProcessor extends WorkerHost{
    constructor(
        private readonly createInfluencerSnapshotUseCase: CreateInfluencerSnapshotUseCase,
        private readonly notifierService: NotifierService,
        private readonly creditsService: CreditLogicRepository,
        private readonly logger: PinoLogger,
    ) {
        super();
    }
    async process(job: Job<CreateInfluencerSnapshotDto>) {
        try {
            const createInfluencerSnapshotDto = job.data
            const result = await this.createInfluencerSnapshotUseCase.execute(createInfluencerSnapshotDto)
            const creditsUpate = await this.creditsService.decreaseCredits(30,createInfluencerSnapshotDto.user)
            this.notifierService.notifyReady(createInfluencerSnapshotDto.user,JobsType.INFLUENCER_SNAPSHOT,{
                jobId: job.id as string,
                entity: result,
                status: StatusQueue.COMPLETED,
                message: 'Influencer snapshot generated',
                creditsUpdate:creditsUpate
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
                'Error generating infleuncer snapshot',
            );
            const errorInfo = ExtractErrorInfo.extract(error, job.id as string);
            this.notifierService.notifyError(createinfluencerDto.user,JobsType.INFLUENCER_SNAPSHOT,errorInfo)
            throw error
        }
    }   
}