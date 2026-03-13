import { Injectable } from "@nestjs/common";
import { DownloadFilePort } from "src/shared/common/application/ports/downlaod-file.port";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { GenerateVideoDto } from "../dtos/generate-video.dto";
import { VideoRepository } from "../../domain/repositories/video.repository";
import { GeneratedVideoVO } from "../../domain/value-objects/generated-video.vo";
import { PathStorage } from "src/shared/common/domain/enums/path-storage";
import { StorageRepository } from "src/shared/common/domain/repositories/storage.repository";

@Injectable()
export class GenerateVideoUseCase{
    constructor(
        private readonly storageService:StorageRepository,
        private readonly downloadService:DownloadFilePort,
        private readonly multimediaService:MultimediaGeneratorPort,
        private readonly videoCommandService:VideoRepository
    ){}
    async execute(dto:GenerateVideoDto){
        const video = await this.multimediaService.createVideo(dto.aspectRatio,dto.prompt,dto.audio)
        const buffer = await this.downloadService.downloadUrl(video)
        const urlStorage = await this.storageService.saveVideo(dto.user,buffer,PathStorage.PATH_VIDEOS)
        const vo = GeneratedVideoVO.create({
            user: dto.user,
            prompt: dto.prompt,
            videoUrl:urlStorage.url,
            aspectRatio:dto.aspectRatio,
            audio:dto.audio,
        })
        return this.videoCommandService.saveGeneratedVideo(vo)
    }
}
