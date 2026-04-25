import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({ description: 'Identificador único del usuario' })
    @IsString()
    @IsNotEmpty({ message: 'El identificador de usuario es obligatorio' })
    user: string;


    @ApiProperty({ 
      description: 'Descripción del estilo musical deseado', 
      example: 'Chill lo-fi beat with soft piano and rain sounds',
      minLength: 3 
    })
    @IsString()
    @MinLength(3, { message: 'El prompt debe ser más descriptivo (mínimo 3 caracteres)' })
    @IsNotEmpty()
    prompt: string;


    @ApiProperty({ 
      description: 'Tempo de la pista (BPM)', 
      minimum: 40, 
      maximum: 220, 
      example: 120 
    })
      @IsNumber()
    @Min(40, { message: 'El BPM mínimo permitido es 40' })
    @Max(220, { message: 'El BPM máximo permitido es 220' })
    bpm: number;


    @ApiProperty({ 
      description: 'Género musical', 
      example: 'Lo-Fi',
    })
    @IsString()
    @IsNotEmpty({ message: 'Debes seleccionar un género musical' })
    genre: string;


    @ApiProperty({ 
      description: 'Duración en milisegundos', 
      minimum: 3000, 
      maximum: 600000, 
      example: 30000 
    })
    @IsNumber()
    @Min(3000, { message: 'La duración mínima es de 3 segundos (3000ms)' })
    @Max(600000, { message: 'La duración máxima permitida por ElevenLabs es de 10 minutos' })
    durationMs: number;


    @ApiProperty({ 
      description: 'Forzar a que la pista sea solo instrumental', 
      default: true,
      required: false 
    })
    @IsBoolean()
    @IsOptional() // Permite que el frontend no lo envíe y use el default
    forceInstrumental: boolean = true;

    
}