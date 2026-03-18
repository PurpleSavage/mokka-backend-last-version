import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TypeStyle } from "src/modules/image/domain/enums/image-styles";
import { TypeSubStyle } from "src/modules/image/domain/enums/image-substyle";
import { AspectRatioImage } from "src/shared/common/infrastructure/enums/image-aspect-ratio";



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