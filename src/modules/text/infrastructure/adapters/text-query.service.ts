import { TextPort } from "../../application/ports/text.port";
import { TextEntity } from "../../domain/entities/text.entity";

export class TextQueryService implements TextPort{
    constructor(){}
    async listTexts(user: string): Promise<TextEntity[]> {
        
    }
}