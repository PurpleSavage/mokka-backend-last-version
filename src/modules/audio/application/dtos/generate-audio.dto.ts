import { IsString, IsNotEmpty, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { IdModelsAudio, ModelsAudio } from '../../domain/enums/audio-models';

export class GenerateAudioDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;


  @IsString()
  @IsNotEmpty()
  user:string

  @IsString()
  @IsNotEmpty()
  @IsEnum(IdModelsAudio)
  idModel:IdModelsAudio

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

