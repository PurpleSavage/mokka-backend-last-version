import { Transform } from "class-transformer"
import {  IsBoolean, IsEnum, IsNotEmpty,IsString, MaxLength } from "class-validator"
import { VideoAspectRatio } from "../../../../../shared/common/domain/enums/video-aspectratio"
import { ApiProperty } from "@nestjs/swagger"

export class GenerateVideoDto{

    @ApiProperty({ 
        description: 'ID de MongoDB del usuario que solicita el video',
        example: '65f1a2b3c4d5e6f7a8b9c0d1' 
    })
    @IsNotEmpty()
    @IsString()
    user:string


    @ApiProperty({ 
        description: 'Descripción detallada de la escena del video',
        example: 'A cinematic sunset over a futuristic neon city, 4k, hyperrealistic',
        maxLength: 100 
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100) 
    prompt:string


    @ApiProperty({ 
        enum: VideoAspectRatio, 
        description: 'Relación de aspecto del video (ej: 16:9, 9:16, 1:1)' 
    })
    @IsEnum(VideoAspectRatio)
    @Transform(({ value }) => value as VideoAspectRatio) //para probar
    aspectRatio:VideoAspectRatio


    @ApiProperty({ 
        description: 'Indica si se debe generar audio para el video',
        default: true 
    })
    @IsBoolean()
    audio:boolean  
}