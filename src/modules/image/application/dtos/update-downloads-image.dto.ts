import { IsNotEmpty, IsString } from "class-validator";

export class UpdateDownloadsSharedImageDto{
    @IsString()
    @IsNotEmpty()
    sharedImage:string
}