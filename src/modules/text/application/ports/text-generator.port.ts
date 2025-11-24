import { ResponseTextGeneratorDto } from "../dtos/responses/response-text-generator.dto";

export abstract class TextGeneratorPort{
    abstract createText(context: string): Promise<ResponseTextGeneratorDto>
}