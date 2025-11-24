import { IsNotEmpty, IsString } from "class-validator";

export class ListHistoryTextDto{
    @IsString()
    @IsNotEmpty()
    user:string
}