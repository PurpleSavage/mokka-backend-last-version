import { Processor, WorkerHost } from "@nestjs/bullmq";
import { GenerateTextUseCase } from "../use-cases/generate-text.use-case";
import { PinoLogger } from "nestjs-pino";
import { JobsType, NotifierService } from "src/notifier/notifier.service";
import { AppBaseError } from "src/shared/errors/base.error";
import { GenerateTextDto } from "../dtos/request/generate-text.dto";
import { Job } from "bullmq";
import { StatusQueue } from "src/shared/infrastructure/enums/status-queue";
import { ExtractErrorInfo } from "src/shared/infrastructure/helpers/ExtractErrorInfo";
import { CreditLogicRepository } from "src/shared/domain/repositories/credits-logic.repository";



@Processor('text-queue')
export class GenerateTextProcessor extends WorkerHost{
    constructor(
      private readonly generateTextUseCase:GenerateTextUseCase,
      private readonly notifierService: NotifierService,
      private readonly logger: PinoLogger,
      private readonly creditsService: CreditLogicRepository,
    ){
        super()
    }
    async process(job: Job<GenerateTextDto>) {
        try {
          const generateTextDto = job.data;
          const result = await this.generateTextUseCase.execute(generateTextDto)
          const creditsUpdated= await this.creditsService.decreaseCredits(30,generateTextDto.user) 
          this.notifierService.notifyReady(generateTextDto.user,JobsType.TEXT,{
            jobId: job.id as string,
            entity: result,
            status: StatusQueue.COMPLETED,
            message: 'Text generated',
            creditsUpdate:creditsUpdated
        })
          
        } catch (error) {
          const textDto = job.data;
          this.logger.error(
            {
              jobId: job.id,
              userId: textDto.user,
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
            'Error generating text',
          );
          const errorInfo = ExtractErrorInfo.extract(error, job.id as string)
          this.notifierService.notifyError( textDto.user,JobsType.TEXT,errorInfo)
          
          throw error;
        }
    }
}