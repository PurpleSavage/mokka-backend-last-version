import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { ShareResourceDto } from "src/shared/common/application/dtos/request/share-resource.dto";

export class ShareVideoDto extends ShareResourceDto{
    @ApiProperty({ 
        description: 'ID de MongoDB del video original a compartir',
        example: '6628aa67c7c7ed3765faf002' 
    })
    @IsString()
    @IsNotEmpty()
    videoId:string
}