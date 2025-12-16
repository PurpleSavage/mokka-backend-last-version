import { VideoEntity } from "../../domain/entities/video.entity";

export abstract class VideoPort{
    abstract listVideos(user:string):Promise<VideoEntity[]>
}