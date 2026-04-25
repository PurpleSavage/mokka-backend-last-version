import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";
import {AspectRatioImage } from "../../../../../shared/common/infrastructure/enums/image-aspect-ratio";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRemixImageDto{
    
    @ApiProperty({ description: 'ID de la imagen base de la comunidad' })
    @IsString()
    @IsNotEmpty()
    imageShared: string;

    @ApiProperty({ description: 'URL de la imagen original', example: 'https://cdn.mokka.ai/img.png' })
    @IsUrl()
    @IsNotEmpty()
    imageUrl: string;

    @ApiProperty({ description: 'URL de la versión previa o miniatura' })
    @IsUrl()
    @IsNotEmpty()
    prevImageUrl: string;

    @ApiProperty({ description: 'ID del usuario que crea el remix' })
    @IsString()
    @IsNotEmpty()
    user: string;

    @ApiProperty({ description: 'Nuevo prompt para el remix', example: 'Mismo estilo pero con luces neón' })
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

    @ApiProperty({ enum: AspectRatioImage, description: 'Relación de aspecto' })
    @IsEnum(AspectRatioImage)
    aspectRatio: AspectRatioImage;
}