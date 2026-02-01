import { InfluencerEntity } from "../entities/influecer.entity";
import { InfluencerSceneEntity } from "../entities/influencer-scene.entity";
import { InfluencerSnapshotEntity } from "../entities/influencer-snapshot.entity";
import { SaveInfluencerVo } from "../value-objects/save-influencer.vo";
import { SaveSceneInfluencerVo } from "../value-objects/save-scene.vo";
import { SaveSnapshotVo } from "../value-objects/save-snapshot.vo";

export abstract class InfluencerRepository {
    abstract saveInfluencerCreated(vo:SaveInfluencerVo):Promise<InfluencerEntity>
    abstract saveSnapshotInfluencer(vo:SaveSnapshotVo):Promise<InfluencerSnapshotEntity>  
    abstract saveSceneInfluencer(vo:SaveSceneInfluencerVo):Promise<InfluencerSceneEntity>  
}