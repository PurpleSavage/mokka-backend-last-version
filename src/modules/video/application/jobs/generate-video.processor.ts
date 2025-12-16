import { Processor, WorkerHost } from "@nestjs/bullmq";
import { GenerateVideoUseCase } from "../use-cases/generate-video.use-case";
import { Job } from "bullmq";
import { GenerateVideoDto } from "../dtos/generate-video.dto";
import { PinoLogger } from "nestjs-pino";
import { AppBaseError } from "src/shared/errors/base.error";
import { NotifierService } from "src/notifier/notifier.service";
import { ExtractErrorInfo } from "src/shared/infrastructure/helpers/ExtractErrorInfo";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";

@Processor('video-queue')
export class GenerateVideoProcessor extends WorkerHost{
    constructor(
        private readonly generateVideoUseCase:GenerateVideoUseCase,
        private readonly imageNotifierService: NotifierService,
        private readonly logger: PinoLogger,
    ){
        super()
    }
    async process(job: Job<GenerateVideoDto>): Promise<void> {
        try {
            const generateVideoDto = job.data
            const result =await this.generateVideoUseCase.execute(generateVideoDto )
            this.imageNotifierService.notifyVideoReady(generateVideoDto.user, {
                jobId: job.id as string,
                entity: result,
                status: StatusQueue.COMPLETED,
                message: 'Image generated',
            });
        } catch (error) {
            const generateVideoDto = job.data
            this.logger.error(
            {
                jobId: job.id,
                 userId: generateVideoDto.user,
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
                this.imageNotifierService.notifyVideoError(
                    generateVideoDto.user,
                    errorInfo,
                )
            throw error
        }
    }
}