import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class ListVideosDto{
    @ApiProperty({
        description: 'ID de MongoDB (ObjectID) del usuario para filtrar su galería de videos',
        example: '65f1a2b3c4d5e6f7a8b9c0d1',
        minLength: 24,
        maxLength: 24,
    })
    @IsMongoId({ message: 'El ID de usuario debe ser un ID de MongoDB válido' })
    @IsString()
    @IsNotEmpty()
    user:string
}