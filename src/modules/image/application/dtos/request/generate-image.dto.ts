import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TypeStyle } from "src/modules/image/domain/enums/image-styles";
import { TypeSubStyle } from "src/modules/image/domain/enums/image-substyle";
import { AspectRatioImage } from "src/shared/common/infrastructure/enums/image-aspect-ratio";



export class GenerateImageDto {
  @ApiProperty({ description: 'ID del usuario solicitante' })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ description: 'Prompt descriptivo', example: 'Un paisaje cyberpunk' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ example: 1024 })
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @ApiProperty({ example: 1024 })
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @ApiProperty({ enum: AspectRatioImage })
  @IsEnum(AspectRatioImage)
  aspectRatio: AspectRatioImage;

  @ApiProperty({ enum: TypeStyle, description: 'Estilo artístico' })
  @IsEnum(TypeStyle)
  style: TypeStyle;

  @ApiProperty({ enum: TypeSubStyle, description: 'Sub-estilo detallado' })
  @IsEnum(TypeSubStyle)
  subStyle: TypeSubStyle;

}