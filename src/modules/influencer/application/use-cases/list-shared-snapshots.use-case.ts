import { CacheManagerPort } from 'src/shared/common/application/ports/cache-manager.port';
import { InfluencerPort } from '../ports/influencer.port';
import { SharedSnapshotEntity } from '../../domain/entities/shared-snapshot.entity';
import { Injectable } from '@nestjs/common';
import { ListResourcesDto } from 'src/shared/common/application/dtos/request/list-resources.dto';

@Injectable()
export class ListSharedSnapshotsUseCase {
  private nameList = 'SHARED_SNAPSHOTS_LIST';
  constructor(
    private readonly influencerQueryService: InfluencerPort,
    private readonly cachemanager: CacheManagerPort,
  ) {}
  async execute(dto: ListResourcesDto) {
    const cacheList = await this.cachemanager.read<SharedSnapshotEntity>(
      this.nameList,
      dto.page,
      dto.limit
    );
    if (cacheList.length > 0) {
      return cacheList;
    }
    const list = await this.influencerQueryService.listSharedSnapshot(
      dto.page,
      dto.limit
    );
    await this.cachemanager.setMany(this.nameList, list);
    return list;
  }
}
