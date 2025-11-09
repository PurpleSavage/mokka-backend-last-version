import { Injectable } from "@nestjs/common";
import { ImageQueryService } from "../../infrastructure/adapters/image-query.service";
import { ListSharedImageDto } from "../dtos/list-shared-image.dto";

@Injectable()
export class ListSharedImageUseCase{
    constructor(
        private readonly imageQueryService:ImageQueryService
    ){}
    execute(listSharedImageDto:ListSharedImageDto){
        return this.imageQueryService.listSharedImage(listSharedImageDto.page)
    }
}