import { IsNotEmpty, IsString } from "class-validator";
import { ShareResourceDto } from "src/shared/common/application/dtos/request/share-resource.dto";

export class ShareVideoDto extends ShareResourceDto{
    @IsString()
    @IsNotEmpty()
    videoId:string
}