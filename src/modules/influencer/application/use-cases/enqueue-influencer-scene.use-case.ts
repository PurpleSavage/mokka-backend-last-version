import { InjectQueue } from "@nestjs/bullmq";
import { HttpStatus, Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { PinoLogger } from "nestjs-pino";
import { CreateInfluencerSceneDto } from "../dtos/responses/create-influencer-scene.dto";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";

@Injectable()
export class EnqueueInfluencerSceneUseCase {
  constructor(
    @InjectQueue('influencer-scene-queue') private readonly sceneQueue: Queue,
    private readonly logger: PinoLogger
  ) {}

  async execute(dto: CreateInfluencerSceneDto) {
    const uniqueJobId = `scene-${dto.influencer}-${Date.now()}`;
    try {
      const job = await this.sceneQueue.add('influencer-scene-queue', dto, {
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
        message: 'Influencer scene generation started',
      };
    } catch (error) {
      this.logger.error('Failed to enqueue scene job', {
        jobId: uniqueJobId,
        influencerId: dto.influencer,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw new MokkaError({
        message: 'The scene generation service is currently saturated or unavailable.',
        status: HttpStatus.SERVICE_UNAVAILABLE,
        errorType: ErrorPlatformMokka.FAILED_JOB,
      });
    }
  }
}