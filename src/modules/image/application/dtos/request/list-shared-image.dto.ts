import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class ListSharedImageDto{
    @ApiPropertyOptional({
        description: 'Número de página para la paginación de la comunidad',
        example: 1,
        default: 1,
        minimum: 1,
    })
    @IsOptional()
    @Type(() => Number) // transforma el query string a número
    @IsInt()
    @Min(1)
    page: number = 1; 
}