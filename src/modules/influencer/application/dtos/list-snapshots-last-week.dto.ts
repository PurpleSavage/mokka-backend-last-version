import { IsNotEmpty, IsString } from "class-validator";

export class ListSnpashotsLastWeekDto{
    @IsString()
    @IsNotEmpty()
    userId:string
}