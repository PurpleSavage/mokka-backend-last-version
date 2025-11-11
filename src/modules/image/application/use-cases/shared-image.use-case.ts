import { Injectable } from "@nestjs/common";
import { ImageCommandService } from "../../infrastructure/adapters/image-command.service";
import { ShareImageDto } from "../dtos/share-image.dto";

@Injectable()
export class ShareImageUseCase{
    constructor(
        private readonly imageCommandService:ImageCommandService
    ){}
    execute(shareImageDto:ShareImageDto){
        return this.imageCommandService.shareImage(shareImageDto.imageId,shareImageDto.sharedBy)
    }
}