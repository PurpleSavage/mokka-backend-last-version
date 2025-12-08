import { VideoEntity } from "../../domain/entities/video.entity";

export abstract class VideoPort{
    abstract listVideos():Promise<VideoEntity[]>
}