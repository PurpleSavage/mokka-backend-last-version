import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";
import { MultimediaGeneratorPort } from "src/shared/common/application/ports/multimedia-generator.port";
import { MultimediaGeneratorError } from "src/shared/errors/multimedia-generator.error";
import { MultimediaErrorTypes } from "../enums/error-detail-types";
import { MultimediaResponseDto } from "../dtos/multimedia-response.dt";
import Replicate, { Prediction } from "replicate";
import { AspectRatioImage } from "src/shared/common/infrastructure/enums/image-aspect-ratio";
import { VideoAspectRatio } from "src/shared/common/domain/enums/video-aspectratio";



@Injectable()
export class MultimediaService implements MultimediaGeneratorPort{
    private videoModel = "google/veo-3"
    private imageModel="google/nano-banana-pro"
    private textModel="google/gemini-3.1-pro"
    private readonly multimediaClient: Replicate
    
    
    constructor(
        private readonly configService:ConfigService,
         private readonly logger: PinoLogger
    ){
        const token = this.configService.get<string>('REPLICATE_API_TOKEN');
        if (!token) {
            throw new Error('REPLICATE_API_TOKEN is not configured.');
        }

        this.multimediaClient = new Replicate({
            auth: token,
        });
      
    }
   
    async createVideo(aspectRatio: string,prompt: string,audio:boolean,referenceImages?:string[]): Promise<string> {
        
        try {
            const isValid = Object.values(VideoAspectRatio).includes(aspectRatio as VideoAspectRatio)
            if (!isValid) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `Invalid aspect ratio. Valid options: ${Object.keys(VideoAspectRatio).join(', ')}`,
                    errorType: 'INVALID_ASPECT_RATIO'
                }, HttpStatus.BAD_REQUEST)
            }
            let prediction: Prediction
            const input = {
                prompt, 
                duration: 8,
                resolution: "1080p",
                reference_images:referenceImages,
                aspect_ratio: aspectRatio,
                audio
            }
            prediction = await this.multimediaClient.predictions.create({
                model:this.videoModel,
                input
           }) 
           prediction = await this.multimediaClient.wait(prediction)
            if (prediction.status !== 'succeeded') {
                throw new MultimediaGeneratorError(
                    'An error occurred while creating video, please try again later.',
                    MultimediaErrorTypes.PREDICTION_FAILED,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
        
            }
            const outputArray = prediction.output as string[]
            
            const videoUrl: string | undefined = Array.isArray(outputArray) ? outputArray[0] : undefined;

            if (!videoUrl) {
                throw new MultimediaGeneratorError(
                    'An error occurred while creating url video, please try again later.',
                    MultimediaErrorTypes.MISSING_OUTPUT,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
        
            }
            return videoUrl
        } catch (error) {
             this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error updating the number of image downloads"
                },
                'Error updating the number of image downloads'
            )
            if (error instanceof MultimediaGeneratorError) {
                throw error;
            }
            if (typeof error === 'object' && error !== null && 'error' in error) {
                throw MultimediaGeneratorError.fromReplicateResponse(error as MultimediaResponseDto)
            }
            if (error instanceof HttpException) {
                throw error;
            }

            // Si no sabemos qué es, lanzamos error genérico
            throw new MultimediaGeneratorError(
                'Unexpected error when generating image',
                MultimediaErrorTypes.PREDICTION_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
    
    async generateImage(config:{
        aspectRatio: string, 
        prompt: string,
        urls?:string[],
        webhookUrl: string, 
        jobId: string
    }):Promise<string>{
        try {
            const { prompt, aspectRatio, urls, webhookUrl, jobId} = config;
            const isValid = Object.values(AspectRatioImage).includes(config.aspectRatio as AspectRatioImage)
            if (!isValid) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `Invalid aspect ratio. Valid options: ${Object.keys(AspectRatioImage).join(', ')}`,
                    errorType: 'INVALID_ASPECT_RATIO'
                }, HttpStatus.BAD_REQUEST);
            }
            const finalWebhookUrl = `${webhookUrl}?&jobId=${jobId}`;
            // 2. Configuración del Input para el modelo
            const input = {
                prompt,
                aspect_ratio: aspectRatio,
                output_format: "jpg",
                image_input: urls
            };

            const prediction = await this.multimediaClient.predictions.create({
                model: this.imageModel,
                input,
                webhook: finalWebhookUrl, // URL del controlador (ej: .../snapshot)
                webhook_events_filter: ["completed"], 
            });

            return prediction.id
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error generating image"
                },
                'Error generating image'
            )
            if (error instanceof MultimediaGeneratorError) {
                throw error;
            }
            if (typeof error === 'object' && error !== null && 'error' in error) {
                throw MultimediaGeneratorError.fromReplicateResponse(error as MultimediaResponseDto)
            }
            if (error instanceof HttpException) {
                throw error;
            }

            // Si no sabemos qué es, lanzamos error genérico
            throw new MultimediaGeneratorError(
                'Unexpected error when generating image',
                MultimediaErrorTypes.PREDICTION_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
    async generateText(context: string): Promise<{text:string}> {
        try {
            const input={
                top_p: 0.7,
                images: [],
                prompt: context,
                videos: [],
                temperature: 1,
                thinking_level: "high",
                max_output_tokens: 1000
            }
            let prediction = await this.multimediaClient.predictions.create({
                model: this.textModel,
                input
            })
            prediction = await this.multimediaClient.wait(prediction);
            if (prediction.status !== 'succeeded') {
                throw new MultimediaGeneratorError(
                    'Text generation failed ',
                    MultimediaErrorTypes.PREDICTION_FAILED,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
            const output = prediction.output as string[] | string;
            let generatedText = '';

            if (Array.isArray(output)) {
                generatedText = output.join('').trim();
            } else if (typeof output === 'string') {
                generatedText = output.trim();
            }

            if (!generatedText) {
                throw new MultimediaGeneratorError(
                    'No text was generated in the response',
                    MultimediaErrorTypes.MISSING_OUTPUT,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            return { text: generatedText };
        } catch (error) {
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message: "Error generating text with AI"
                },
                'Error generating text'
            );

            if (error instanceof MultimediaGeneratorError || error instanceof HttpException) {
                throw error;
            }

            if (typeof error === 'object' && error !== null && 'error' in error) {
                throw MultimediaGeneratorError.fromReplicateResponse(error as MultimediaResponseDto);
            }

            throw new MultimediaGeneratorError(
                'Unexpected error when generating text',
                MultimediaErrorTypes.PREDICTION_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
}