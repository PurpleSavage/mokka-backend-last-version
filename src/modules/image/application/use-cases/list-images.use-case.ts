import { Injectable } from "@nestjs/common";

import { ListImagesDto } from "../dtos/list-images.dto";
import { ImagePort } from "../ports/image.port";

@Injectable()
export class ListImagesUseCase{
    constructor(
        private readonly imageQueryService:ImagePort
    ){}
    execute(listImagesDto:ListImagesDto){
        return this.imageQueryService.listImagesByUserId(listImagesDto.user)
    }
}