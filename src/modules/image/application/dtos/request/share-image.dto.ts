import { IsNotEmpty, IsString } from "class-validator";

export class ShareImageDto{
    @IsString()
    @IsNotEmpty()
    image:string


    @IsString()
    @IsNotEmpty()
    sharedBy:string
}