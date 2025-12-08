import { Injectable } from "@nestjs/common";
import { ListHistoryTextDto } from "../dtos/request/list-history-text.dto";
import { TextPort } from "../ports/text.port";
import { TextEntity } from "../../domain/entities/text.entity";

Injectable()
export class ListTextHistoryUseCase{
    constructor(
        private readonly textQueryService:TextPort
    ){}
    execute(dto:ListHistoryTextDto):Promise<TextEntity[]>{
        return this.textQueryService.listTexts(dto.user)
    }
}