import { HttpStatus, Injectable } from "@nestjs/common";
import { VideoPort } from "../../application/ports/video.port";
import { VideoEntity } from "../../domain/entities/video.entity";
import { PinoLogger } from "nestjs-pino";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";
import { VideoDocument } from "../schemas/video.schema";
import { Model} from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { VideoSharedEntity } from "../../domain/entities/video-shared.entity";
import { SharedVideoDocument } from "../schemas/video-shared.schema";
import { UserDocument } from "src/shared/common/infrastructure/schemas/user.schema";
import { SharedByEntity } from "src/shared/common/domain/entities/shared-by.entity";
import { normalizeId } from "src/shared/common/application/helpers/normalized-obj";

@Injectable()
export class VideoQueryService implements VideoPort{
    constructor(
        @InjectModel('Video') private readonly videoModel: Model<VideoDocument>,
        @InjectModel('SharedVideo') private readonly sharedVideoModel: Model<SharedVideoDocument>,
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
                .setId(video._id.toString())
                .setPrompt(video.prompt)
                .setVideoUrl(video.videoUrl)
                .setAspectRatio(video.aspectRatio)
                .setCreateDate(video.createdAt)
                .setAudio(video.audio)
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
    async listSharedVideos(page: number, limit: number): Promise<VideoSharedEntity[]> {
        try {
            const skip = (page - 1) * limit;
            const sharedVideosDocs= await this.sharedVideoModel
            .find()
            .populate<{ video:VideoDocument}>('video')
            .populate<{ sharedBy: UserDocument }>('sharedBy')
            .sort({ createdAt: -1,_id: -1 })
            .skip(skip)
            .limit(limit)
            .exec()
            return sharedVideosDocs.map((doc)=>{
                const video = doc.video
                const user = doc.sharedBy

                const sharedBy = new SharedByEntity()
                .setId(user._id.toString())
                .setEmail(user.email)
                .build()

                const videoEntity= new VideoEntity()
                .setId(video._id.toString())
                .setPrompt(video.prompt)
                .setVideoUrl(video.videoUrl)
                .setAspectRatio(video.aspectRatio)
                .setCreateDate(video.createdAt)
                .setAudio(video.audio)
                .build()

                return new VideoSharedEntity()
                .setSharedBy(normalizeId(sharedBy))
                .setDownloads(doc.downloads)
                .setId(doc._id.toString())
                .setRemixes(doc.remixes)
                .setVideo(videoEntity)
                .build();
            })
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error to list shared videos"
                },
                'Error listing shared videos'
            )
            throw new MokkaError({
                message: 'Error to list shared videos"',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
}