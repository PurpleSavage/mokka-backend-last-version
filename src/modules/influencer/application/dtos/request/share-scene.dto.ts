import { IsNotEmpty, IsString } from "class-validator";
import { ShareResourceDto } from "src/shared/common/application/dtos/request/share-resource.dto";

export class ShareSceneDto extends ShareResourceDto{
    @IsString()
    @IsNotEmpty()
    sceneId:string
}