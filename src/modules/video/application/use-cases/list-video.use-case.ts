import { VideoEntity } from "../../domain/entities/video.entity";
import { VideoPort } from "../ports/video.port";

export class ListVideosUseCase{
    constructor(
        private readonly videoQueryService: VideoPort
    ){}
    execute(user:string):Promise<VideoEntity[]>{
        return this.videoQueryService.listVideos(user)
    }
}