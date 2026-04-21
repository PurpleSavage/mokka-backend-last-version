import { IsNotEmpty, IsString } from "class-validator";

export class ListVideosDto{
    @IsString()
    @IsNotEmpty()
    user:string
}