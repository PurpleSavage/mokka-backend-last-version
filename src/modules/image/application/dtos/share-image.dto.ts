import { IsNotEmpty, IsString } from "class-validator";

export class ShareImageDto{
    @IsString()
    @IsNotEmpty()
    imageId:string


    @IsString()
    @IsNotEmpty()
    sharedBy:string
}