import { Injectable } from "@nestjs/common";
import { ImageCommandService } from "../../infrastructure/adapters/image-command.service";
import { CreateRemixImageDto } from "../dtos/create-remix-image.dto";

@Injectable()
export class CreateRemixImageUseCase{
    constructor(
        private readonly imageCommandService:ImageCommandService
    ){}
    execute(createRemixImageDto:CreateRemixImageDto){
        return this.imageCommandService.createRemixImage(createRemixImageDto.imageSharedId)
    }
}