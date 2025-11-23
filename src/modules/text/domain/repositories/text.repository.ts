import { TextEntity } from "../entities/text.entity";
import { GenerateTextVO } from "../value-objects/generate-text.vo";

export abstract class TextRepository{
     abstract saveText(generateTextVO:GenerateTextVO):Promise<TextEntity>
}