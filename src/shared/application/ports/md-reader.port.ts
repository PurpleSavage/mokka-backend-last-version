export abstract class MdReaderPort {
  abstract loadPrompt(templateName: string, moduleName: string): Promise<string>;
  abstract fillTemplate<T extends object>(template: string, dto: T): string;
}