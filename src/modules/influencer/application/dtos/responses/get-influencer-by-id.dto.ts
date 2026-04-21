import { IsNotEmpty, IsString } from "class-validator";

export class GetInfluencerByIdDto{
    @IsString()
    @IsNotEmpty()
    influencerId:string
}