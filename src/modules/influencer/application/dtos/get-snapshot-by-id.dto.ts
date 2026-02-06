import { IsNotEmpty, IsString } from "class-validator";

export class getSnapshotByIdDto{
    @IsString()
    @IsNotEmpty()
    snapshotId:string
}