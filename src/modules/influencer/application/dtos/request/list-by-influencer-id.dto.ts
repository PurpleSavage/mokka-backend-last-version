import { IsNotEmpty, IsString } from "class-validator";

export class ListByInfluencerDto{
    @IsNotEmpty()
    @IsString()
    influencer:string
}