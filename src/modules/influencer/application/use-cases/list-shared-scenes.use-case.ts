import { CacheManagerPort } from 'src/shared/common/application/ports/cache-manager.port';
import { InfluencerPort } from '../ports/influencer.port';
import { SharedSceneEntity } from '../../domain/entities/shared-scene.entity';
import { Injectable } from '@nestjs/common';
import { ListResourcesDto } from 'src/shared/common/application/dtos/request/list-resources.dto';

@Injectable()
export class ListSharedScenesUseCase {
  private nameList = 'SHARED_SCENES_LIST';
  constructor(
    private readonly influencerQueryService: InfluencerPort,
    private readonly cachemanager: CacheManagerPort,
  ) {}
  async execute(dto:ListResourcesDto) {
    const cacheList = await this.cachemanager.read<SharedSceneEntity>(
      this.nameList,
      dto.page,
      dto.limit
    )
    if (cacheList.length > 0) {
      return cacheList;
    }
    const list = await this.influencerQueryService.listSharedScene(
      dto.page,
      dto.limit
    )
    await this.cachemanager.setMany(this.nameList, list);
    return list
  }
}
