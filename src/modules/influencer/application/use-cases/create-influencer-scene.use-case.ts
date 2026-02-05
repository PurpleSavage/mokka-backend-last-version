import { DownloadFilePort } from "src/shared/application/ports/downlaod-file.port";

import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { InfluencerRepository } from "../../domain/repository/influencer.repository";
import { CreateInfluencerSceneDto } from "../dtos/create-influencer-scene.dto";
import { PathStorage } from "src/shared/domain/enums/path-storage";
import { SaveSceneInfluencerVo } from "../../domain/value-objects/save-scene.vo";

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