
import { InfluencerEntity } from "./influecer.entity"
import { BaseSharedEntity } from "../../../../shared/domain/entities/base-shared.entity";

export class SharedInfluencerEntity extends BaseSharedEntity {
    private influencer: InfluencerEntity | string;

    public getInfluencer(): InfluencerEntity | string { return this.influencer; }
    
    public setInfluencer(influencer: InfluencerEntity | string): this {
        this.influencer = influencer;
        return this;
    }
}