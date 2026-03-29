import { 
  IsString, 
  IsNumber, 
  IsBoolean, 
  IsNotEmpty, 
  Min, 
  Max, 
  IsOptional, 
  MinLength 
} from 'class-validator';

export class GenerateMusicDto {
    @IsString()
    @IsNotEmpty({ message: 'El identificador de usuario es obligatorio' })
    user: string;

    @IsString()
    @MinLength(3, { message: 'El prompt debe ser más descriptivo (mínimo 3 caracteres)' })
    @IsNotEmpty()
    prompt: string;

    @IsNumber()
    @Min(40, { message: 'El BPM mínimo permitido es 40' })
    @Max(220, { message: 'El BPM máximo permitido es 220' })
    bpm: number;

    @IsString()
    @IsNotEmpty({ message: 'Debes seleccionar un género musical' })
    genre: string;

    @IsNumber()
    @Min(3000, { message: 'La duración mínima es de 3 segundos (3000ms)' })
    @Max(600000, { message: 'La duración máxima permitida por ElevenLabs es de 10 minutos' })
    durationMs: number;

    @IsBoolean()
    @IsOptional() // Permite que el frontend no lo envíe y use el default
    forceInstrumental: boolean = true;

    
}