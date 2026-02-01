import { Injectable } from "@nestjs/common";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { InfluencerRepository } from "../../domain/repository/influencer.repository";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { DownloadFilePort } from "src/shared/application/ports/downlaod-file.port";
import { CreateInfluencerDto } from "../dtos/create-influencer.dto";
import { MdReaderPort } from "src/shared/application/ports/md-reader.port";
import { PathStorage } from "src/shared/domain/enums/path-storage";
import { SaveInfluencerVo } from "../../domain/value-objects/save-influencer.vo";


@Injectable()
export class CreateInfluencerUseCase{
    constructor(
        private readonly influencerCommandService:InfluencerRepository,
        private readonly storageService:StorageRepository,
        private readonly downloadService:DownloadFilePort,
        public readonly multimediaService:MultimediaGeneratorPort,
        private readonly mdReaderService:MdReaderPort,
    ){}
    async execute(dto:CreateInfluencerDto){
        const defaultAspectRatio="1:1"
        const promptmd = await this.mdReaderService.loadPrompt('generator_influencer','influencer')
        const templateFill = this.mdReaderService.fillTemplate(promptmd,dto)
        const imageUrl= await this.multimediaService.createImage(defaultAspectRatio,templateFill)
        const buffer = await this.downloadService.downloadUrl(imageUrl)
        const response = await this.storageService.saveImage(buffer,dto.user,PathStorage.PATH_INFLUENCER)
        const vo =SaveInfluencerVo.create(
            {
                user: dto.user,
                name: dto.name,
                ageRange: dto.ageRange,
                gender: dto.gender,
                bodyShape: dto.bodyShape,
                skinColor: dto.skinColor, 
                eyeColor: dto.eyeColor,
                hairType: dto.hairType,
                faceType: dto.faceType,
                country: dto.country,
                lipsType: dto.lipsType,
                hairColor: dto.hairColor,
                height: dto.height,
                influencerUrlImage: response.url,
                size:response.size
            }
        )
        const influencerGenerated = await this.influencerCommandService.saveInfluencerCreated(vo)
        return influencerGenerated
    }
}