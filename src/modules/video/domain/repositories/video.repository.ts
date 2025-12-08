import { VideoEntity } from "../entities/video.entity";
import { GeneratedVideoVO } from "../value-objects/generated-video.vo";

export abstract class VideoRepository{
    abstract saveGeneratedVideo(vo:GeneratedVideoVO):Promise<VideoEntity>
}