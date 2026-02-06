import { IsNotEmpty, IsString } from "class-validator";

export class ListScenesLastWeekDto{
    @IsString()
    @IsNotEmpty()
    userId:string
}