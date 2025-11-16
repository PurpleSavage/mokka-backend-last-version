import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";
import { AspectRatio } from "../../domain/enums/image-aspect-ratio";

export class CreateRemixImageDto{
    
    @IsNotEmpty()
    @IsString()
    imageShared:string


    @IsNotEmpty()
    @IsUrl()
    imageUrl:string

    @IsNotEmpty()
    @IsUrl()
    prevImageUrl:string

    @IsString()
    @IsNotEmpty()
    user:string
    
    @IsString()
    @IsNotEmpty()
    prompt: string;
    
    @IsNumber()
    @IsNotEmpty()
    width: number;
    
    @IsNumber()
    @IsNotEmpty()
    height: number;
    
    @IsEnum(AspectRatio)
    aspectRatio:AspectRatio
}