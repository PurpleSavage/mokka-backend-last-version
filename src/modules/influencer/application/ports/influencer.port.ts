import { InfluencerEntity } from "../../domain/entities/influecer.entity";
import { InfluencerSceneEntity } from "../../domain/entities/influencer-scene.entity";
import { InfluencerSnapshotEntity } from "../../domain/entities/influencer-snapshot.entity";
import { SharedInfluencerEntity } from "../../domain/entities/shared-influencer.entity";
import { SharedSceneEntity } from "../../domain/entities/shared-scene.entity";
import { SharedSnapshotEntity } from "../../domain/entities/shared-snapshot.entity";

export abstract class InfluencerPort {
    abstract historyInfluencerSnapshot(userId:string):Promise<InfluencerSnapshotEntity[]>
    abstract getSnapshotById(snapshotID:string):Promise<InfluencerSnapshotEntity>
    abstract influencersSnapshotLastWeek(userId:string):Promise<InfluencerSnapshotEntity[]>


    abstract listInfluencers(userId:string): Promise<InfluencerEntity[]>
    abstract getInfluencerById(id: string): Promise<InfluencerEntity>

    abstract historyInfluencerScenes(userId:string):Promise<InfluencerSceneEntity[]>
    abstract influencerScenesLastWeek(userId:string):Promise<InfluencerSceneEntity[]>
    abstract getInfluencerSceneById(sceneId:string):Promise<InfluencerSceneEntity>


    abstract listSharedInfluencer(page:number):Promise<SharedInfluencerEntity[]>
    abstract listSharedSnapshot(page:number):Promise<SharedSnapshotEntity[]>
    abstract listSharedScene(page:number):Promise<SharedSceneEntity[]>
}