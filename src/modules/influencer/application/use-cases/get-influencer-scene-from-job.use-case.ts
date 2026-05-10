import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { PinoLogger } from "nestjs-pino";
import { CreateInfluencerSceneDto } from "../dtos/responses/create-influencer-scene.dto";

@Injectable()
export class GetInfluencerSceneFromJobUseCase{
    constructor(
        @InjectQueue('influencer-scene-queue') private readonly influencerSceneQueue: Queue,
        private readonly logger: PinoLogger,
    ){}
    async execute(jobId: string):Promise<Job<CreateInfluencerSceneDto> | null>{
        try {
            const job = await this.influencerSceneQueue.getJob(jobId);
            
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