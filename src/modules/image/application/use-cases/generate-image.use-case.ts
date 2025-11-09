import { Injectable } from "@nestjs/common";
import { GenerateImageDto } from "../dtos/generate-image.dto";
import { MdReaderPort } from "src/shared/application/ports/md-reader.port";
import { ImageRepository } from "../../domain/repositories/image.repository";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { DownloadFilePort } from "src/shared/application/ports/downlaod-file.port";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { SavedGenerateImageVO } from "../../domain/value-objects/saved-generate-image.vo";

@Injectable()
export class GenerateImageUseCase{
    constructor(
        private readonly mdReaderService:MdReaderPort,
        private readonly imageCommandService:ImageRepository,
        private readonly storageService:StorageRepository,
        private readonly downloadService:DownloadFilePort,
        private readonly multimediaService:MultimediaGeneratorPort
    ){}
    async execute(generateImageDto:GenerateImageDto){
        const {aspectRatio} = generateImageDto
        const pormptmd = await this.mdReaderService.loadPrompt('generator_image','aiimage')
        const templateFill = this.mdReaderService.fillTemplate(pormptmd,generateImageDto)
        const imageUrl = await this.multimediaService.createImage(aspectRatio,templateFill)
        const buffer = await this.downloadService.downloadUrl(imageUrl)
        const storageResponse = await this.storageService.saveImage(buffer,generateImageDto.userId)

        const imageGenerated = new SavedGenerateImageVO()
        .setAspectRatio(generateImageDto.aspectRatio)
        .setHeight(generateImageDto.height)
        .setImageUrl(storageResponse.url)
        .setPrompt(generateImageDto.prompt)
        .setSize(storageResponse.size)
        .setStyle(generateImageDto.style)
        .setSubStyle(generateImageDto.subStyle)
        .setUserId(generateImageDto.userId)
        .setWidth(generateImageDto.width)
        .build()

        return await this.imageCommandService.savedGeneratedImage(imageGenerated)
    }
}