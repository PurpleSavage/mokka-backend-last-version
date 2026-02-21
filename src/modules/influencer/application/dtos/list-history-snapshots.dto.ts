import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class ListHistorySnapshotsDto{

    @IsString()
    @IsNotEmpty()
    userId:string


    @IsOptional()
    @Type(() => Number) // transforma el query string a número
    @IsInt()
    @Min(1)
    page: number = 1; 
}