import { InfluencerEntity } from "../entities/influecer.entity";
import { InfluencerSnapshotEntity } from "../entities/influencer-snapshot.entity";
import { SaveInfluencerVo } from "../value-objects/save-influencer.vo";
import { SaveSnapshotVo } from "../value-objects/save-snapshot.vo";

export abstract class InfluencerRepository {
    abstract saveInfluencerCreated(vo:SaveInfluencerVo):Promise<InfluencerEntity>
    abstract saveSnapshotInfluencer(vo:SaveSnapshotVo):Promise<InfluencerSnapshotEntity>    
}