import { IsNotEmpty, IsString } from "class-validator";

export class ListHistorySnapshotsDto{

    @IsString()
    @IsNotEmpty()
    userId:string
}