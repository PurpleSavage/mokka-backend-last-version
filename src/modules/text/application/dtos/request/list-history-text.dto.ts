import { IsNotEmpty, IsString } from "class-validator";

export class ListHistoryText{
    @IsString()
    @IsNotEmpty()
    user:string
}