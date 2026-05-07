import { InjectQueue } from "@nestjs/bullmq";
import { HttpStatus, Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { PinoLogger } from "nestjs-pino";
import { CreateInfluencerSnapshotDto } from "../dtos/responses/create-influencer-snapshot.dto";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";

@Injectable()
export class EnqueueInfluencerSnapshotUseCase {
  constructor(
    @InjectQueue('influencer-snapshot-queue') private readonly snapshotQueue: Queue,
    private readonly logger: PinoLogger,
  ) {}

  async execute(dto: CreateInfluencerSnapshotDto) {
    const uniqueJobId = `snapshot-${dto.influencer}-${Date.now()}`;
    try {
      const job = await this.snapshotQueue.add('influencer-snapshot-queue', dto, {
        removeOnComplete: false,
        removeOnFail: true,
        jobId:uniqueJobId,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });

      return {
        jobId: job.id,
        status: StatusQueue.PROCESSING,
        message: 'Influencer snapshot generation started',
      };
    } catch (error) {
      this.logger.error('Failed to enqueue snapshot job', {
        jobId: uniqueJobId,
        influencerId: dto.influencer,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      throw new MokkaError({
        message: 'The snapshot generation service is temporarily unavailable. Please try again later.',
        errorType: ErrorPlatformMokka.FAILED_JOB,
        status: HttpStatus.SERVICE_UNAVAILABLE,
      });
    }
  }
}