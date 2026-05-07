import { InjectQueue } from '@nestjs/bullmq';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { CreateInfluencerDto } from '../dtos/responses/create-influencer.dto';
import { StatusQueue } from 'src/shared/common/infrastructure/enums/status-queue';
import { MokkaError } from 'src/shared/errors/mokka.error';
import { Queue } from 'bullmq';
import { ErrorPlatformMokka } from 'src/shared/common/infrastructure/enums/error-detail-types';

@Injectable()
export class EnqueueInfluencerUseCase {
  constructor(
    @InjectQueue('influencer-queue') private readonly influencerQueue: Queue,
    private readonly logger: PinoLogger,
  ) {}

  async execute(dto: CreateInfluencerDto) {
    const uniqueJobId = `influencer-${dto.user}-${Date.now()}`;
    try {
      const job = await this.influencerQueue.add('influencer-queue', dto, {
        jobId: uniqueJobId,
        removeOnComplete: false,
        removeOnFail: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      });

      return {
        jobId: job.id,
        status: StatusQueue.PROCESSING,
        message: 'Influencer generation started',
      };
    } catch (error) {
      this.logger.error('Failed to enqueue influencer job', {
        jobId: uniqueJobId,
        userId: dto.user,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw new MokkaError({
        message:
          'The generation engine is currently unavailable or saturated. Please try again in a few minutes.',
        status: HttpStatus.SERVICE_UNAVAILABLE,
        errorType: ErrorPlatformMokka.FAILED_JOB,
      });
    }
  }
}
