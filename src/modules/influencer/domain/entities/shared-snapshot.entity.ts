import { BaseSharedEntity } from '../../../../shared/domain/entities/base-shared.entity';
import { InfluencerSnapshotEntity } from './influencer-snapshot.entity';

export class SharedSnapshotEntity extends BaseSharedEntity {
  private snapshot: InfluencerSnapshotEntity | string;

  public getSnapshot(): InfluencerSnapshotEntity  | string {
    return this.snapshot;
  }

  public setSnapshot(snapshot: InfluencerSnapshotEntity  | string): this {
    this.snapshot = snapshot;
    return this;
  }
}
