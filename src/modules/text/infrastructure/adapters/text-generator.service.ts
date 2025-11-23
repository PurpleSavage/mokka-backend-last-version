import { ConfigService } from "@nestjs/config";
import { TextGeneratorPort } from "../../application/ports/text-generator.port";
import OpenAI from "openai";
import {  ResponseTextGeneratorDto } from "../../application/dtos/responses/response-text-generator.dto";
import { OpenAIErrorResponse, TextGeneratorError } from "src/shared/errors/text-generator.error";
import { HttpException, HttpStatus } from "@nestjs/common";
import { OpenAIErrorTypes } from "src/shared/infrastructure/enums/error-detail-types";
import { PinoLogger } from "nestjs-pino";


export class TextGeneratorService implements TextGeneratorPort{
    private llmClient: OpenAI;
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger
    ) {
        const apiKey = this.configService.get<string>('OPEN_AI_API_KEY')
        if (!apiKey) {
            throw new Error('OPEN_AI_API_KEY not found in environment variables');
        }
        this.llmClient = new OpenAI({ apiKey });
    }
    async createText(context: string): Promise<ResponseTextGeneratorDto> {
        try {
            const response = await this.llmClient.responses.create({
                model: "gpt-4",
                input: context
            })

            return {
                text: response.output_text
            };
        } catch (error) {
            this.logger.error(
                {
                stack: error instanceof Error ? error.stack : undefined,
                message: 'Error generating text with OpenAI',
                },
                'OpenAI text generation failed'
            );

            // 1. Si ya es nuestro error personalizado, re-lanzarlo
            if (error instanceof TextGeneratorError) {
                throw error;
            }

            // 2. Si es un error de OpenAI con estructura conocida
            if (typeof error === 'object' && error !== null && 'error' in error) {
                throw TextGeneratorError.fromOpenAIResponse(error as OpenAIErrorResponse);
            }

            // 3. Si es un HttpException de NestJS, re-lanzarlo
            if (error instanceof HttpException) {
                throw error;
            }

            // 4. Error desconocido
            throw new TextGeneratorError(
                'Unexpected error when generating text',
                OpenAIErrorTypes.UNKNOWN_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
  }
}