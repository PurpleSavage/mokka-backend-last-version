import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { PinoLogger } from "nestjs-pino";
import { CreateInfluencerDto } from "../dtos/responses/create-influencer.dto";

@Injectable()
export class GetInfluencerFromJobUseCase{
    constructor(
        @InjectQueue('influencer-queue') private readonly influencerQueue: Queue,
        private readonly logger: PinoLogger,
    ){}
    async execute(jobId: string):Promise<Job<CreateInfluencerDto> | null>{
        try {
            const job = await this.influencerQueue.getJob(jobId);
            
            if (!job) {
                this.logger.warn(`Job ${jobId} not found in Redis`);
                return null;
            }

        return job;
        } catch (error) {
            this.logger.error(`Error retrieving job ${jobId}`, {
                error: error instanceof Error ? error.message : String(error),
            });
            return null;
        }
    }
}