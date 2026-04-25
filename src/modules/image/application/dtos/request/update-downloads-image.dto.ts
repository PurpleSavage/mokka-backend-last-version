import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateDownloadsSharedImageDto{
    @ApiProperty({ description: 'ID de la imagen compartida', example: 'adaw3u32833eiehnu-124321415fwfw-jeyoqmbvekdhqñkj024' })
    @IsString()
    @IsNotEmpty()
    sharedImage:string
}