import { Transform } from "class-transformer"
import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsNotEmpty,IsOptional,IsString, MaxLength } from "class-validator"
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

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayMaxSize(2)
    referenceImages?:string[]
}