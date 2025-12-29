import { PinoLogger } from "nestjs-pino";
import { VideoEntity } from "../../domain/entities/video.entity";
import { VideoRepository } from "../../domain/repositories/video.repository";
import { InjectModel } from "@nestjs/mongoose";
import { VideoDocument } from "../schemas/video.schema";
import { Model } from "mongoose";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";
import { HttpStatus } from "@nestjs/common";
import { GeneratedVideoVO } from "../../domain/value-objects/generated-video.vo";

export class VideoCommandService implements VideoRepository{
    constructor(
        @InjectModel('Video') private readonly videoModel: Model<VideoDocument>,
        private readonly logger: PinoLogger
    ){}
    async saveGeneratedVideo(vo:GeneratedVideoVO): Promise<VideoEntity> {
        try {
            const video = new this.videoModel({
                user:vo.user,
                prompt:vo.prompt,
                videoUrl:vo.videoUrl,
                height:vo.height,
                width:vo.width,
                aspectRatio:vo.aspectRatio,
                audio:vo.audio,
                referenceImages:vo.referenceImages
            })
            const savedVideo = await video.save()
            return new VideoEntity()
            .setId(savedVideo._id.toString())
            .setPrompt(savedVideo.prompt)
            .setVideoUrl(savedVideo.videoUrl)
            .setAspectRatio(savedVideo.aspectRatio)
            .setHeight(savedVideo.height)
            .setWidth(savedVideo.width)
            .setCreateDate(savedVideo.createdAt)
            .setAudio(savedVideo.audio)
            .setReferenceImages(savedVideo.referenceImages)
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
}