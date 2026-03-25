import { IsNotEmpty, IsString } from "class-validator";

export class ReadNotificationRequestDto{
    @IsNotEmpty()
    @IsString()
    notificationId:string
}