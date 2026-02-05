import { Transform } from "class-transformer"
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator"
import { VideoAspectRatio } from "src/shared/domain/enums/video-aspectratio"


export class CreateInfluencerSceneDto{

    @IsNotEmpty()
    @IsString()
    user:string


    @IsNotEmpty()
    @IsString()
    influencer:string


    @IsOptional()
    @IsString({ each: true }) 
    @IsUrl({}, { each: true })
    imageBaseUrls:string[]

    
    @IsNotEmpty()
    @IsString()
    prompt:string

    @IsNotEmpty()
    @IsBoolean()
    volume:boolean

   @IsEnum(VideoAspectRatio)
    @Transform(({ value }) => value as VideoAspectRatio) 
    aspectRatio:VideoAspectRatio
}