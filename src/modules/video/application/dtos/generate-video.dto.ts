import { Transform } from "class-transformer"
import {  IsBoolean, IsEnum, IsNotEmpty,IsString, MaxLength } from "class-validator"
import { VideoAspectRatio } from "../../../../shared/domain/enums/video-aspectratio"

export class GenerateVideoDto{

    @IsNotEmpty()
    @IsString()
    user:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(100) 
    prompt:string




    @IsEnum(VideoAspectRatio)
    @Transform(({ value }) => value as VideoAspectRatio) //para probar
    aspectRatio:VideoAspectRatio

    @IsBoolean()
    audio:boolean

    
}