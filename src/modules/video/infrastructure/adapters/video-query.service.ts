import { HttpStatus, Injectable } from "@nestjs/common";
import { VideoPort } from "../../application/ports/video.port";
import { VideoEntity } from "../../domain/entities/video.entity";
import { PinoLogger } from "nestjs-pino";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";
import { VideoDocument } from "../schemas/video.schema";
import { Model} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class VideoQueryService implements VideoPort{
    constructor(
        @InjectModel('Video') private readonly videoModel: Model<VideoDocument>,
        private readonly logger: PinoLogger
    ){}
    async listVideos(user: string): Promise<VideoEntity[]> {
        try {
            

            const listVideos = await this.videoModel.find({
                user
            })
            .sort({ _id: -1 })
            .exec()

            return listVideos.map((video)=>{
                return new VideoEntity()
                .setAspectRatio(video.aspectRatio)
                .setCreateDate(video.createdAt)
                .setHeight(video.height)
                .setId(video._id.toString())
                .setPrompt(video.prompt)
                .setVideoUrl(video.videoUrl)
                .setWidth(video.width)
                .build()
            })
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