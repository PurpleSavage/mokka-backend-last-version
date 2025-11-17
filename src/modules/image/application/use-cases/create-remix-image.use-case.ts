import { Injectable } from "@nestjs/common";
import { CreateRemixImageDto } from "../dtos/create-remix-image.dto";
import { ImageRepository } from "../../domain/repositories/image.repository";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { RemixImageVo } from "../../domain/value-objects/remix-image.vo";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { DownloadFilePort } from "src/shared/application/ports/downlaod-file.port";


@Injectable()
export class CreateRemixImageUseCase{
    constructor(
        private readonly imageCommandService:ImageRepository,
        public readonly multimediaService:MultimediaGeneratorPort,
         private readonly storageService:StorageRepository,
         private readonly downloadService:DownloadFilePort,
    ){}
    async execute(createRemixImageDto:CreateRemixImageDto){
        const urlRemixImage= await this.multimediaService.createRemixBasedImage(createRemixImageDto.imageUrl,createRemixImageDto.prompt)
        const imagebuffer = await this.downloadService.downloadUrl(urlRemixImage)
        const imageUrlStorage = await this.storageService.saveImage(imagebuffer,createRemixImageDto.user)
        const imageSharedId =await this.imageCommandService.updateRemixes(createRemixImageDto.imageShared)
        const vo = RemixImageVo.create({
            user:createRemixImageDto.user,
            prompt: createRemixImageDto.prompt,
            width: createRemixImageDto.width,
            height: createRemixImageDto.height,
            imageUrl:imageUrlStorage.url,
            aspectRatio:createRemixImageDto.aspectRatio,
            imageBase:imageSharedId,
            size:imageUrlStorage.size,
            prevImageUrl:createRemixImageDto.prevImageUrl
        })

        const savedImage = await this.imageCommandService.saveRemixImage(vo)
        return savedImage
    }
}