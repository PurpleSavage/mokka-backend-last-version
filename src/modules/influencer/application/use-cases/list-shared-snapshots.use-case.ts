import { CacheManagerPort } from 'src/shared/application/ports/cache-manager.port';
import { ListSharedDto } from '../dtos/list-shared.dto';
import { InfluencerPort } from '../ports/influencer.port';
import { SharedSnapshotEntity } from '../../domain/entities/shared-snapshot.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListSharedSnapshotsUseCase {
  private nameList = 'SHARED_SNAPSHOTS_LIST';
  constructor(
    private readonly influencerQueryService: InfluencerPort,
    private readonly cachemanager: CacheManagerPort,
  ) {}
  async execute(dto: ListSharedDto) {
    const cacheList = await this.cachemanager.read<SharedSnapshotEntity>(
      this.nameList,
      dto.page,
    );
    if (cacheList.length > 0) {
      return cacheList;
    }
    const list = await this.influencerQueryService.listSharedSnapshot(
      dto.page,
    );
    await this.cachemanager.setMany(this.nameList, list);
    return list;
  }
}
