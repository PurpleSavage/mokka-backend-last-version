import { Injectable } from "@nestjs/common";
import { ImageCommandService } from "../../infrastructure/adapters/image-command.service";
import {  UpdateDownloadsSharedImageDto } from "../dtos/update-downloads-image.dto";

@Injectable()
export class UpdateDownloadsSharedImageUseCase{
    constructor(
        private readonly imageCommandService:ImageCommandService
    ){}
    async execute(updateDownloadsImageDto:UpdateDownloadsSharedImageDto){
        return this.imageCommandService.updateDownLoadsSharedImage(updateDownloadsImageDto.sharedImageId)
    }
}