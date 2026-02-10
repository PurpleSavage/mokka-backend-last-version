
import { InfluencerSceneEntity } from "./influencer-scene.entity";
import { BaseSharedEntity } from "../../../../shared/domain/entities/base-shared.entity";


export class SharedSceneEntity extends BaseSharedEntity {
    private scene: InfluencerSceneEntity | string;

    public getScene(): InfluencerSceneEntity | string { return this.scene; }

    public setScene(scene: InfluencerSceneEntity | string): this {
        this.scene = scene;
        return this;
    }
}