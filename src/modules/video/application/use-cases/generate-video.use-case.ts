import { Injectable } from "@nestjs/common";
import { DownloadFilePort } from "src/shared/application/ports/downlaod-file.port";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { GenerateVideoDto } from "../dtos/generate-video.dto";

@Injectable()
export class GenerateVideoUseCase{
    constructor(
        //private readonly imageCommandService:ImageRepository,
        private readonly storageService:StorageRepository,
        private readonly downloadService:DownloadFilePort,
        private readonly multimediaService:MultimediaGeneratorPort
    ){}
    async execute(dto:GenerateVideoDto){
        const video = await this.multimediaService.createVideo(dto.aspectRatio,dto.prompt,dto.audio,dto.referenceImages)
        const buffer = await this.downloadService.downloadUrl(video)
        const urlStorage = await this.storageService.saveVideo(dto.user,buffer)
        //falta guardar video en la base de datos
        console.log(urlStorage)
    }
}