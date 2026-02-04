import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AspectRatioImage } from "../../../../shared/infrastructure/enums/image-aspect-ratio";
import { TypeStyle } from "../../domain/enums/image-styles";
import { TypeSubStyle } from "../../domain/enums/image-substyle";


export class GenerateImageDto {
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

  @IsEnum(AspectRatioImage)
  aspectRatio:AspectRatioImage


  @IsEnum(TypeStyle)
  style:TypeStyle

  @IsEnum(TypeSubStyle)
  subStyle: TypeSubStyle;

}