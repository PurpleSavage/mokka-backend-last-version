import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { PinoLogger } from "nestjs-pino";
import { CreateInfluencerSnapshotDto } from "../dtos/responses/create-influencer-snapshot.dto";

@Injectable()
export class GetInfluencerSnapshotFromJobUseCase{
    constructor(
        @InjectQueue('influencer-snapshot-queue') private readonly influencerSnapshotQueue: Queue,
        private readonly logger: PinoLogger,
    ){}
    async execute(jobId:string):Promise<Job<CreateInfluencerSnapshotDto> | null>{
        try {
            const job = await this.influencerSnapshotQueue.getJob(jobId);
            
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