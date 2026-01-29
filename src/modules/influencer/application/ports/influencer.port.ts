import { InfluencerEntity } from "../../domain/entities/influecer.entity";

export abstract class InfluencerPort {
    abstract listInfluencers(userId:string): Promise<InfluencerEntity[]>;
    abstract getInfluencerById(id: string): Promise<InfluencerEntity>;
}