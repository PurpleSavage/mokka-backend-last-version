import { InfluencerEntity } from "../entities/influecer.entity";
import { InfluencerSceneEntity } from "../entities/influencer-scene.entity";
import { InfluencerSnapshotEntity } from "../entities/influencer-snapshot.entity";
import { SharedInfluencerEntity } from "../entities/shared-influencer.entity";
import { SharedSceneEntity } from "../entities/shared-scene.entity";
import { SharedSnapshotEntity } from "../entities/shared-snapshot.entity";
import { SaveInfluencerVo } from "../value-objects/save-influencer.vo";
import { SaveSceneInfluencerVo } from "../value-objects/save-scene.vo";
import { SaveSnapshotVo } from "../value-objects/save-snapshot.vo";

export abstract class InfluencerRepository {
    abstract saveInfluencerCreated(vo:SaveInfluencerVo):Promise<InfluencerEntity>
    abstract saveSnapshotInfluencer(vo:SaveSnapshotVo):Promise<InfluencerSnapshotEntity>  
    abstract saveSceneInfluencer(vo:SaveSceneInfluencerVo):Promise<InfluencerSceneEntity>  

    abstract shareInfluencer(influencerId: string, sharedBy: string):Promise<SharedInfluencerEntity>
    abstract shareScene(sceneId:string, sharedBy: string):Promise<SharedSceneEntity>
    abstract shareSnapshot(snapshotId:string, sharedBy: string):Promise<SharedSnapshotEntity>


    
}