import { Injectable } from "@nestjs/common";

import { ShareImageDto } from "../dtos/share-image.dto";
import { ImageRepository } from "../../domain/repositories/image.repository";

@Injectable()
export class ShareImageUseCase{
    constructor(
        private readonly imageCommandService:ImageRepository
    ){}
    execute(shareImageDto:ShareImageDto){
        return this.imageCommandService.shareImage(shareImageDto.imageId,shareImageDto.sharedBy)
    }
}