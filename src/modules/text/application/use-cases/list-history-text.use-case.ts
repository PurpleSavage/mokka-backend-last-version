import { ListHistoryTextDto } from "../dtos/request/list-history-text.dto";
import { TextPort } from "../ports/text.port";

export class ListTextHistoryUseCase{
    constructor(
        private readonly textQueryService:TextPort
    ){}
    execute(dto:ListHistoryTextDto){
        return this.textQueryService.listTexts(dto.user)
    }
}