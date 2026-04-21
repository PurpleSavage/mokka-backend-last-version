import { Injectable } from "@nestjs/common";
import { ShareSnapshotDto } from "../dtos/request/share-snapshot.dto";
import { InfluencerRepository } from "../../domain/repository/influencer.repository";
import { CacheManagerPort } from "src/shared/common/application/ports/cache-manager.port";
import { SharedSnapshotEntity } from "../../domain/entities/shared-snapshot.entity";

@Injectable()
export class ShareSnapshotUseCase{
    private nameList = 'shared-snapshots:list';
    constructor(
        private readonly influencerCommandService:InfluencerRepository,
        private readonly cacheService: CacheManagerPort,
    ){}
    async execute(dto:ShareSnapshotDto){
        const  response = await this.influencerCommandService.shareSnapshot(dto.snapshotId,dto.sharedBy)
        const cacheLength = await this.cacheService.length(this.nameList)
        if (cacheLength > 0) {
            await this.cacheService.set<SharedSnapshotEntity>(this.nameList, response);
        }
        return response
    }   
}