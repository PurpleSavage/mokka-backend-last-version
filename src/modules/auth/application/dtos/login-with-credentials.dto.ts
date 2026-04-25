import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginWithCredentialsDto {
  @ApiProperty({ 
    description: 'Correo electrónico del usuario', 
    example: 'jeanpaul@mokka.ai' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  

  @ApiProperty({ 
    description: 'Contraseña de la cuenta', 
    example: 'mokkaPassword123',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}