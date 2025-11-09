import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AspectRatio } from "../../domain/enums/image-aspect-ratio";
import { TypeStyle } from "../../domain/enums/image-styles";
import { TypeSubStyle } from "../../domain/enums/image-substyle";


export class GenerateImageDto {
  @IsString()
  @IsNotEmpty()
  userId:string

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


  @IsEnum(TypeStyle)
  style:TypeStyle

  @IsEnum(TypeSubStyle)
  subStyle: TypeSubStyle;

}