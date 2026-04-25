import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { GenerateMusicDto } from "../dtos/generate-music.dto";
import { JobsNotificationsType } from "src/shared/notifications/domain/enums/jons-notifications-type";
import { StatusQueue } from "src/shared/common/infrastructure/enums/status-queue";
import { SavedNotificationVO } from "src/shared/notifications/domain/value-objects/saved-notification.vo";
import { SocketErrorResponseDto } from "src/shared/notifications/application/dtos/request/socket-error-response.dto";
import { StorageRepository } from "src/shared/common/domain/repositories/storage.repository";
import { CreditLogicRepository } from "src/shared/common/domain/repositories/credits-logic.repository";
import { NotifierService } from "src/shared/notifications/infrastructure/sockets/notifier.service";
import { SaveNotificationUseCase } from "src/shared/notifications/application/use-cases/save-notification.use-cae";
import { PinoLogger } from "nestjs-pino";
import { MusicRepository } from "../../domain/repositories/music.repository";
import { GeneratedMusicVO } from "../../domain/value-objects/generated-music.vo";
import { AppBaseError } from "src/shared/errors/base.error";
import { ExtractErrorInfo } from "src/shared/common/infrastructure/helpers/ExtractErrorInfo";
import { SocketReadyResponseDto } from "src/shared/notifications/application/dtos/request/socket-ready-response.dto";
import { MusicEntity } from "../../domain/entities/music.entity";
import { PathStorage } from "src/shared/common/domain/enums/path-storage";

@Injectable()
export class SaveMusicUseCase{
    constructor(
        private readonly musicCoammandService: MusicRepository,
        private readonly storageService: StorageRepository,
        private readonly creditsService: CreditLogicRepository,
        private readonly notifierService: NotifierService,
        private readonly saveNotificationUseCase:SaveNotificationUseCase,
        private readonly logger: PinoLogger,
    ){}

    @OnEvent('music.processing.completed', { async: true })
    async execute(eventData: {
        payload: GenerateMusicDto;
        audioBuffer: Buffer<ArrayBuffer>;
        jobId: string;
    }){
        const { payload, audioBuffer, jobId } = eventData;
        try {
            const { url } = await this.storageService.saveAudio(
                payload.user,
                audioBuffer,
                PathStorage.PATH_MUSIC
            );
            const vo = GeneratedMusicVO.create({
                user: payload.user,
                prompt: payload.prompt,
                bpm: payload.bpm,
                genre: payload.genre,
                durationMs: payload.durationMs,
                forceInstrumental: payload.forceInstrumental       ,
                songUrl: url,
            })

            const music = await this.musicCoammandService.saveSong(vo)

            const creditsUpdated = await this.creditsService.decreaseCredits(
                50,
                payload.user,
            )
            const voNotification = SavedNotificationVO.create({
                user: payload.user,
                title: 'Music generated',
                status: StatusQueue.COMPLETED,
                notificationType: JobsNotificationsType.MUSIC,
                message: 'Music generated successfully',
            })
            const savedNotification = await this.saveNotificationUseCase.execute(voNotification);
                 
            const socketResponse = SocketReadyResponseDto.create<MusicEntity>({
                    jobId,
                    notificationType: JobsNotificationsType.MUSIC,
                    notification: savedNotification,
                    entity: music,
                    creditsUpdated,
            });
            this.notifierService.notifyReady(socketResponse);
        } catch (error) {
            this.logger.error(
                    {
                      jobId: jobId,
                      userId: payload.user,
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
                  );
                  const errorInfo = ExtractErrorInfo.extract(error, jobId);
            
                  const voNotification = SavedNotificationVO.create({
                    user: payload.user,
                    title: 'Music failed',
                    status: StatusQueue.FAILED,
                    notificationType: JobsNotificationsType.MUSIC,
                    message: errorInfo.error,
                    details: errorInfo.details,
                    errorType: errorInfo.errorType,
                  })
                  const savedNotification =await this.saveNotificationUseCase.execute(voNotification);
            
                  const socketResponse = SocketErrorResponseDto.create({
                    jobId: errorInfo.jobId,
                    notificationType: JobsNotificationsType.MUSIC,
                    notification: savedNotification,
                    error: errorInfo.error,
                    errorType: errorInfo.errorType,
                    statusCode: errorInfo.statusCode,
                    details: errorInfo.details,
                  })
            
                  this.notifierService.notifyError(socketResponse)
                }
        }
}