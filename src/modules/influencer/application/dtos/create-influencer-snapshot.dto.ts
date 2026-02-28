import {IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator"
import { AspectRatioImage } from "src/shared/infrastructure/enums/image-aspect-ratio"
import { OutfitType } from "../../domain/enums/valid-outfits"
import { Environment } from "../../domain/enums/valid-eviroments"

export class CreateInfluencerSnapshotDto{
    @IsNotEmpty()
    @IsString({ each: true }) 
    @IsUrl({}, { each: true })
    url:string[]

    @IsNotEmpty()
    @IsString()
    user:string

    @IsNotEmpty()
    @IsString()
    influencer:string

    @IsNotEmpty()
    @IsString()
    prompt:string

    @IsEnum(AspectRatioImage)
    aspectRatio:AspectRatioImage


    @IsEnum(OutfitType)
    outfitStyle:OutfitType

    @IsEnum(Environment)
    enviroment:Environment
}