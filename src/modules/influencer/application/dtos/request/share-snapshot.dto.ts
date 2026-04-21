import { IsNotEmpty, IsString } from "class-validator";
import { ShareResourceDto } from "src/shared/common/application/dtos/request/share-resource.dto";

export class ShareSnapshotDto extends ShareResourceDto{
    @IsNotEmpty()
    @IsString()
    snapshotId:string
}