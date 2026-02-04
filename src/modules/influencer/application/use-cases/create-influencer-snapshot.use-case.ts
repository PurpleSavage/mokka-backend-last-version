import { Injectable } from "@nestjs/common";
import { DownloadFilePort } from "src/shared/application/ports/downlaod-file.port";
import { MdReaderPort } from "src/shared/application/ports/md-reader.port";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { StorageRepository } from "src/shared/domain/repositories/storage.repository";
import { InfluencerRepository } from "../../domain/repository/influencer.repository";
import { CreateInfluencerSnapshotDto } from "../dtos/create-influencer-snapshot.dto";
import { PathStorage } from "src/shared/domain/enums/path-storage";
import { SaveSnapshotVo } from "../../domain/value-objects/save-snapshot.vo";

@Injectable()
export class CreateInfluencerSnapshotUseCase{
    constructor(
        private readonly influencerCommandService:InfluencerRepository,
        private readonly storageService:StorageRepository,
        private readonly downloadService:DownloadFilePort,
        public readonly multimediaService:MultimediaGeneratorPort,
        private readonly mdReaderService:MdReaderPort,
    ){}
    async execute(dto:CreateInfluencerSnapshotDto){
        const promptmd = await this.mdReaderService.loadPrompt('generator_influencer','influencer')
        const templateFill = this.mdReaderService.fillTemplate(promptmd,dto)
        const config = {
            aspectRatio: dto.aspectRatio, 
            prompt:templateFill,
            urls:dto.urls,
        }
         
        const imageUrl = await this.multimediaService.generateImage(config)
        const buffer = await this.downloadService.downloadUrl(imageUrl)
        const responseStorage= await this.storageService.saveImage(buffer,dto.user,PathStorage.PATH_INFLUENCERS_SNPASHOTS)
        const vo = SaveSnapshotVo.create({
            user:dto.user,
            influencer:dto.influencer,
            snapshotUrl:responseStorage.url,
            prompt:dto.prompt,
            enviroment:dto.enviroment,
            outfitStyle:dto.outfitStyle,
        })
        return this.influencerCommandService.saveSnapshotInfluencer(vo)
    }
}