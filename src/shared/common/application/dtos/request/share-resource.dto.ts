import { IsNotEmpty, IsString } from "class-validator";

export class ShareResourceDto{
    @IsString()
    @IsNotEmpty()
    sharedBy:string
}