import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginWithGoogleDto{
    @ApiProperty({ 
        description: 'Token de ID proporcionado por Google tras el login social',
        example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY...' 
    })
    @IsString()
    @IsNotEmpty()
    googleToken: string; 
}