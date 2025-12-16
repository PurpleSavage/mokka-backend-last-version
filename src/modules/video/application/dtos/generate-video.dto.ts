import { Transform } from "class-transformer"
import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsIn, IsNotEmpty, IsNumber,IsOptional,IsString, MaxLength } from "class-validator"
import { VideoAspectRatio } from "../../domain/enums/video-aspectratio"

export class GenerateVideoDto{

    @IsNotEmpty()
    @IsString()
    user:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(100) 
    prompt:string


    @IsNotEmpty()
    @IsNumber()
    @IsIn([1280,720,960,1104,1584])
    height:number

    @IsNotEmpty()
    @IsNumber()
    @IsIn([720,1280,960,832,672])
    width:number


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