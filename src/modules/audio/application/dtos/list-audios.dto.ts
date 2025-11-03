import { IsNotEmpty, IsString } from "class-validator";

export class ListAudiosDto{
    @IsString()
    @IsNotEmpty()
    idUser:string
}