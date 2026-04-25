import { IsString, IsNotEmpty, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { IdModelsAudio, ModelsAudio } from '../../domain/enums/audio-models';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateAudioDto {
  @ApiProperty({ 
    description: 'Texto o descripción para generar el audio', 
    example: 'Hola, bienvenido a Mokka AI, tu plataforma de generación multimedia.' 
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiProperty({ description: 'ID del usuario propietario' })
  @IsString()
  @IsNotEmpty()
  user:string

  @ApiProperty({ 
    enum: IdModelsAudio, 
    description: 'ID técnico del modelo de ElevenLabs' 
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(IdModelsAudio)
  idModel:IdModelsAudio


  @ApiProperty({ 
    enum: ModelsAudio, 
    description: 'Nombre descriptivo del modelo' 
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(ModelsAudio)
  nameModelAudio:ModelsAudio


  @IsNumber()
  speed:number

  @IsNumber()
  stability:number

  @IsNumber()
  similarity:number

  @IsNumber()
  exaggeration:number 


  @IsBoolean()
  useSpeakerBoost:boolean
}  

