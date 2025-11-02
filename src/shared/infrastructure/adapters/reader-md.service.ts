import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';
import { MdReaderPort } from "src/shared/application/ports/md-reader.port";

@Injectable()
export class SharedMdReaderService implements MdReaderPort{
  private readonly templateCache = new Map<string, {content: string, timestamp: number}>();
  private readonly CACHE_TTL = 5 * 60 * 1000;

  async loadPrompt(templateName: string,moduleName:string): Promise<string> {
    const cached = this.templateCache.get(templateName);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) return cached.content;

    const filePath = path.join(__dirname, '..', '..','contexts',moduleName, 'prompts', `${templateName}.md`)
    const templateContent = await fs.promises.readFile(filePath, 'utf8');
    this.templateCache.set(templateName, { content: templateContent, timestamp: Date.now() });
    return templateContent;
  }

  fillTemplate<T extends object>(template: string, dto: T): string {
    return template.replace(/{{(.*?)}}/g, (_, key: string) => {
      const typedKey = key.trim() as keyof T;
      const value = dto[typedKey];
      return value !== undefined ? String(value) : '';
    });
  }
}