
import { TextEntity } from "../../domain/entities/text.entity";
import { TextRepository } from "../../domain/repositories/text.repository";
import { GenerateTextVO } from "../../domain/value-objects/generate-text.vo";

export class TextCommandService implements TextRepository{
    constructor(){}
    async saveText(generateTextVO: GenerateTextVO): Promise<TextEntity> {
        
    }
}