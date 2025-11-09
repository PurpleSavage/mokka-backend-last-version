import { Injectable } from "@nestjs/common";
import { ImageQueryService } from "../../infrastructure/adapters/image-query.service";
import { ListImagesDto } from "../dtos/list-images.dto";

@Injectable()
export class ListImagesUseCase{
    constructor(
        private readonly imageQueryService:ImageQueryService
    ){}
    execute(listImagesDto:ListImagesDto){
        return this.imageQueryService.listImagesByUserId(listImagesDto.userId)
    }
}