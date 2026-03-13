import { DownloadFilePort } from "src/shared/common/application/ports/downlaod-file.port";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { InfluencerRepository } from "../../domain/repository/influencer.repository";
import { CreateInfluencerSceneDto } from "../dtos/create-influencer-scene.dto";
import { PathStorage } from "src/shared/common/domain/enums/path-storage";
import { SaveSceneInfluencerVo } from "../../domain/value-objects/save-scene.vo";
import { Injectable } from "@nestjs/common";
import { StorageRepository } from "src/shared/common/domain/repositories/storage.repository";

@Injectable()
export class CreateInFluencerSceneUseCase{
    constructor(
        private readonly influencerCommandService:InfluencerRepository,
        private readonly storageService:StorageRepository,
        private readonly downloadService:DownloadFilePort,
        private readonly multimediaService:MultimediaGeneratorPort,
     
    ){}
    async execute(dto:CreateInfluencerSceneDto){
        const video = await this.multimediaService.createVideo(dto.aspectRatio,dto.prompt,dto.volume,dto.imageBaseUrls)
        const buffer = await this.downloadService.downloadUrl(video)
        const storageresponse = await this.storageService.saveVideo(dto.user,buffer,PathStorage.PATH_INFLUENCERS_SCENES)
        const vo = SaveSceneInfluencerVo.create({
            urlScene:storageresponse.url,
            prompt:dto.prompt,
            influencer:dto.influencer,
            volume:dto.volume,
            user:dto.user,
            imageBaseUrls:dto.imageBaseUrls,
            aspectRatio:dto.aspectRatio
        })
        return await this.influencerCommandService.saveSceneInfluencer(vo)
    }
}