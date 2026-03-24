import { Injectable } from "@nestjs/common";
import { ImagePort } from "../ports/image.port";

@Injectable()
export class ListImagesLastWeekUseCase{
    constructor(
        private readonly imageService:ImagePort
    ){}
    execute(userId:string){
        return this.imageService.listImagesLastWeek(userId)
    }
}