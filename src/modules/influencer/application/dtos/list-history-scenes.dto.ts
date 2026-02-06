import { IsNotEmpty, IsString } from "class-validator";

export class ListHistoryScenesDto{
    
    @IsString()
    @IsNotEmpty()
    userId:string
}