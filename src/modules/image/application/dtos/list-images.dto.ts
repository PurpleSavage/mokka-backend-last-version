import { IsNotEmpty, IsString } from "class-validator";

export class ListImagesDto{
    @IsString()
    @IsNotEmpty()
    userId:string
    
}