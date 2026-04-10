import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class ListResourcesDto{
    @IsOptional()
    @Type(() => Number) // transforma el query string a número
    @IsInt()
    @Min(1)
    page: number = 1; 


    @IsOptional()
    @Type(() => Number) // transforma el query string a número
    @IsInt()
    @Min(1)
    limit: number = 6; 
}