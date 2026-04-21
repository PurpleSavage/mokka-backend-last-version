import { IsNotEmpty, IsString } from "class-validator";

export class ListInfluencersDto{
    @IsString()
    @IsNotEmpty()
    user:string
}