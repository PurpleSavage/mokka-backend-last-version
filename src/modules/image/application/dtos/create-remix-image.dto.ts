import { IsNotEmpty, IsString } from "class-validator";

export class CreateRemixImageDto{
    @IsNotEmpty()
    @IsString()
    imageSharedId:string
}