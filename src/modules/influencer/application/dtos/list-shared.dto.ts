import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

// este dto es para todas las listas de archivos multimedia comaprtido
export class ListSharedDto{
    @IsOptional()
    @Type(() => Number) // transforma el query string a número
    @IsInt()
    @Min(1)
    page: number = 1; 
}