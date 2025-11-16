import { Injectable } from "@nestjs/common";
import { CreateRemixImageDto } from "../dtos/create-remix-image.dto";
import { ImageRepository } from "../../domain/repositories/image.repository";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { RemixImageVo } from "../../domain/value-objects/remix-image.vo";


@Injectable()
export class CreateRemixImageUseCase{
    constructor(
        private readonly imageCommandService:ImageRepository,
        public readonly multimediaService:MultimediaGeneratorPort
    ){}
    async execute(createRemixImageDto:CreateRemixImageDto){
        const urlRemixImage= await this.multimediaService.createRemixBasedImage(createRemixImageDto.imageUrl,createRemixImageDto.prompt)
        const vo = RemixImageVo.create({
            user:createRemixImageDto.user,
            prompt: createRemixImageDto.prompt,
            width: createRemixImageDto.width,
            height: createRemixImageDto.height,
            imageUrl:urlRemixImage,
            aspectRatio:createRemixImageDto.aspectRatio,
            imageShared:createRemixImageDto.imageShared
        })

        const savedImage = await this.imageCommandService.saveRemixImage(vo)
        return savedImage
    }
}