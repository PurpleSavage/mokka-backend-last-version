import { Injectable } from "@nestjs/common";
import {  UpdateDownloadsSharedImageDto } from "../dtos/update-downloads-image.dto";
import { ImageRepository } from "../../domain/repositories/image.repository";

@Injectable()
export class UpdateDownloadsSharedImageUseCase{
    constructor(
        private readonly imageCommandService:ImageRepository
    ){}
    async execute(updateDownloadsImageDto:UpdateDownloadsSharedImageDto){
        return this.imageCommandService.updateDownLoadsSharedImage(updateDownloadsImageDto.sharedImage)
    }
}