import { Transform } from "class-transformer"
import { IsArray, IsBoolean, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"
import { VideoAspectRatio } from "../../domain/enums/video-aspectratio"

export class GenerateRemixVideoDto{

    @IsNotEmpty()
    @IsString()
    user:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(100) 
    prompt:string


    @IsNotEmpty()
    @IsNumber()
    @IsIn([1920,1080])
    height:number

    @IsNotEmpty()
    @IsNumber()
    @IsIn([1920,1080])
    width:number


    @IsEnum(VideoAspectRatio)
    @Transform(({ value }) => value as VideoAspectRatio) //para probar
    aspectRatio:VideoAspectRatio


    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    referenceImages:string[]


    @IsBoolean()
    audio:boolean
}