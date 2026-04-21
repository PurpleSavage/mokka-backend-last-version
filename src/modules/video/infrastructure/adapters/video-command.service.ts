import { PinoLogger } from "nestjs-pino";
import { VideoEntity } from "../../domain/entities/video.entity";
import { VideoRepository } from "../../domain/repositories/video.repository";
import { InjectModel } from "@nestjs/mongoose";
import { VideoDocument } from "../schemas/video.schema";
import { Model } from "mongoose";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";
import { HttpStatus, Injectable } from "@nestjs/common";
import { GeneratedVideoVO } from "../../domain/value-objects/generated-video.vo";
import { SharedVideoDocument } from "../schemas/video-shared.schema";
import { VideoSharedEntity } from "../../domain/entities/video-shared.entity";
import { normalizeId } from "src/shared/common/application/helpers/normalized-obj";

@Injectable()
export class VideoCommandService implements VideoRepository{
    constructor(
        @InjectModel('Video') private readonly videoModel: Model<VideoDocument>,
        private readonly logger: PinoLogger,
        @InjectModel('SharedVideo') private readonly sharedVideoModel: Model<SharedVideoDocument>,
    ){}
    async saveGeneratedVideo(vo:GeneratedVideoVO): Promise<VideoEntity> {
        try {
            const video = new this.videoModel({
                user:vo.user,
                prompt:vo.prompt,
                videoUrl:vo.videoUrl,
                aspectRatio:vo.aspectRatio,
                audio:vo.audio,
            })
            const savedVideo = await video.save()
            return new VideoEntity()
            .setId(savedVideo._id.toString())
            .setPrompt(savedVideo.prompt)
            .setVideoUrl(savedVideo.videoUrl)
            .setAspectRatio(savedVideo.aspectRatio)
            .setCreateDate(savedVideo.createdAt)
            .setAudio(savedVideo.audio)
            .build()
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error to save generated video"
                },
                'Error saving video'
            )
            throw new MokkaError({
                message: 'Error to save generated video"',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
    async shareVideo(videoId: string, sharedBy: string): Promise<VideoSharedEntity> {
        try {
            const response = new this.sharedVideoModel({
                sharedBy,
                downloads:0,
                remixes: 0,
                video:videoId
            })
            const sharedVideo = await response.save()
            return new VideoSharedEntity()
            .setId(sharedVideo._id.toString())
            .setDownloads(sharedVideo.downloads)
            .setRemixes(sharedVideo.remixes)
            .setSharedBy(normalizeId(sharedVideo.sharedBy))
            .setVideo(normalizeId(sharedVideo.video))
            .build()
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error to share video"
                },
                'Error sharing video'
            )
            throw new MokkaError({
                message: 'Error to share video"',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
}