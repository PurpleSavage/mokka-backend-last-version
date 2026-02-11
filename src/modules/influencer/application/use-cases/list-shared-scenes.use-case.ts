import { CacheManagerPort } from 'src/shared/application/ports/cache-manager.port';
import { InfluencerPort } from '../ports/influencer.port';
import { SharedSceneEntity } from '../../domain/entities/shared-scene.entity';
import { ListSharedDto } from '../dtos/list-shared.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListSharedScenesUseCase {
  private nameList = 'SHARED_SCENES_LIST';
  constructor(
    private readonly influencerQueryService: InfluencerPort,
    private readonly cachemanager: CacheManagerPort,
  ) {}
  async execute(dto:ListSharedDto) {
    const cacheList = await this.cachemanager.read<SharedSceneEntity>(
      this.nameList,
      dto.page,
    )
    if (cacheList.length > 0) {
      return cacheList;
    }
    const list = await this.influencerQueryService.listSharedScene(
      dto.page,
    )
    await this.cachemanager.setMany(this.nameList, list);
    return list
  }
}
