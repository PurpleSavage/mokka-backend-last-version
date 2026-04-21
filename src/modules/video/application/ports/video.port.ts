import { VideoSharedEntity } from "../../domain/entities/video-shared.entity";
import { VideoEntity } from "../../domain/entities/video.entity";

export abstract class VideoPort{
    abstract listVideos(user:string):Promise<VideoEntity[]>
    abstract listSharedVideos(page:number,limit:number):Promise<VideoSharedEntity[]>
}