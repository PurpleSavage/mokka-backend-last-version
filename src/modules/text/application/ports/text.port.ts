import { TextEntity } from "../../domain/entities/text.entity";

export abstract class TextPort{
    abstract listTexts(user:string):Promise<TextEntity[]>
}