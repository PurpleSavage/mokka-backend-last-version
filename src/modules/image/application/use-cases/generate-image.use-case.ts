import { Injectable } from "@nestjs/common";
import { GenerateImageDto } from "../dtos/generate-image.dto";
import { MdReaderPort } from "src/shared/application/ports/md-reader.port";
import { ImageRepository } from "../../domain/repositories/image.repository";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { DownloadFilePort } from "src/shared/application/ports/downlaod-file.port";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { SavedGenerateImageVO } from "../../domain/value-objects/saved-generate-image.vo";
import { PathStorage } from "src/shared/domain/enums/path-storage";

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
        
        const pormptmd = await this.mdReaderService.loadPrompt('generator-image','image')
        const templateFill = this.mdReaderService.fillTemplate(pormptmd,generateImageDto)
        const config = {
            aspectRatio: generateImageDto.aspectRatio, 
            prompt: templateFill,
        }
        const imageUrl = await this.multimediaService.generateImage(config)
        const buffer = await this.downloadService.downloadUrl(imageUrl)
        const storageResponse = await this.storageService.saveImage(buffer,generateImageDto.user,PathStorage.PATH_IMAGE)

        const imageGenerated = SavedGenerateImageVO.create({
            user: generateImageDto.user,
            prompt: generateImageDto.prompt,
            width: generateImageDto.width,
            height: generateImageDto.height,
            aspectRatio: generateImageDto.aspectRatio,
            imageUrl: storageResponse.url,
            size: storageResponse.size,
            style: generateImageDto.style,
            subStyle: generateImageDto.subStyle,
        })

        return await this.imageCommandService.savedGeneratedImage(imageGenerated)
    }
}