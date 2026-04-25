import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class ListImagesDto{
    @ApiProperty({
        description: 'El ObjectID de MongoDB del usuario',
        example: '65f1a2b3c4d5e6f7a8b9c0d1', // Ejemplo real de un ObjectId de 24 caracteres
        minLength: 24,
        maxLength: 24,
    })
    @IsMongoId({ message: 'El ID de usuario debe ser un ID de MongoDB válido' })
    @IsString()
    @IsNotEmpty()
    user:string
    
}