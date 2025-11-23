export abstract class TextGeneratorPort{
    abstract createText(context: string): Promise<unknown>
}