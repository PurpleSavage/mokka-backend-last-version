import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ShareImageDto{
    @ApiProperty({ description: 'ID de la imagen original generada', example: 'img_orig_456' })
    @IsString()
    @IsNotEmpty()
    image:string


    @IsString()
    @IsNotEmpty()
    sharedBy:string
}