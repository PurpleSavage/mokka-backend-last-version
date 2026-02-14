import { Injectable } from "@nestjs/common";
import { ListHistoryTextDto } from "../dtos/request/list-history-text.dto";
import { TextPort } from "../ports/text.port";
import { TextEntity } from "../../domain/entities/text.entity";

@Injectable()
export class ListTextHistoryUseCase{
    constructor(
        private readonly textQueryService:TextPort
    ){}
    async execute(dto:ListHistoryTextDto):Promise<TextEntity[]>{
        const textos= await this.textQueryService.listTexts(dto.user)
        return textos
    }
}