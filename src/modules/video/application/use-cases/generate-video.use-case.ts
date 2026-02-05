import { Injectable } from "@nestjs/common";
import { DownloadFilePort } from "src/shared/application/ports/downlaod-file.port";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { GenerateVideoDto } from "../dtos/generate-video.dto";
import { VideoRepository } from "../../domain/repositories/video.repository";
import { GeneratedVideoVO } from "../../domain/value-objects/generated-video.vo";
import { PathStorage } from "src/shared/domain/enums/path-storage";

@Injectable()
export class GenerateVideoUseCase{
    constructor(
        private readonly storageService:StorageRepository,
        private readonly downloadService:DownloadFilePort,
        private readonly multimediaService:MultimediaGeneratorPort,
        private readonly videoCommandService:VideoRepository
    ){}
    async execute(dto:GenerateVideoDto){
        const video = await this.multimediaService.createVideo(dto.aspectRatio,dto.prompt,dto.audio,dto.referenceImages)
        const buffer = await this.downloadService.downloadUrl(video)
        const urlStorage = await this.storageService.saveVideo(dto.user,buffer,PathStorage.PATH_VIDEOS)
        const vo = GeneratedVideoVO.create({
            user: dto.user,
            prompt: dto.prompt,
            width: dto.width,
            height: dto.height,
            videoUrl:urlStorage.url,
            aspectRatio:dto.aspectRatio,
            audio:dto.audio,
            referenceImages:dto.referenceImages
        })
        return this.videoCommandService.saveGeneratedVideo(vo)
    }
}