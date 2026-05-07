import { InjectQueue } from "@nestjs/bullmq";
import { HttpStatus, Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { PinoLogger } from "nestjs-pino";
import { GenerateAudioDto } from "../dtos/generate-audio.dto";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";
import { MokkaError } from "src/shared/errors/mokka.error";

@Injectable()
export class EnqueueAudioUseCase{
    constructor(
        @InjectQueue('audio-queue') private readonly audioQueue: Queue,
        private readonly logger: PinoLogger
    ){}
    async execute(dto:GenerateAudioDto){
        const uniqueJobId = `audio-${dto.user}-${Date.now()}`;
        try {
            const job = await this.audioQueue.add('audio-queue', dto, {
                removeOnComplete: false,
                removeOnFail: true,
                jobId: uniqueJobId, 
                attempts: 3,
                backoff: {
                type: 'exponential',
                delay: 1000,
                },
            });
            return {
                jobId: job.id,
                status: StatusQueue.PROCESSING,
                message: 'Audio generation started',
            };
        } catch (error) {
            this.logger.error('Failed to enqueue audio job', {
                    jobId: uniqueJobId,
                    influencerId: dto.user,
                    error: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                  });
            
            throw new MokkaError({
                message: 'The audio generation service is currently saturated or unavailable.',
                status: HttpStatus.SERVICE_UNAVAILABLE,
                errorType: ErrorPlatformMokka.FAILED_JOB,
            });
        }
    }
}