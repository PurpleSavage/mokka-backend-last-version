import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";
import { MultimediaGeneratorError } from "src/shared/errors/multimedia-generator.error";
import { MultimediaErrorTypes } from "../enums/error-detail-types";
import { MultimediaResponseDto } from "../dtos/multimedia-response.dt";
import Replicate, { Prediction } from "replicate";
import { AspectRatioImage } from "src/modules/image/domain/enums/image-aspect-ratio";
import { VideoAspectRatio } from "src/modules/video/domain/enums/video-aspectratio";


@Injectable()
export class MultimediaService implements MultimediaGeneratorPort{
    private videoModel = "google/veo-3"
    private imageModel="google/nano-banana-pro"
    private imageRemixModel = "black-forest-labs/flux-kontext-pro" 
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
    async createImage(aspectRatio: string, prompt: string): Promise<string> {
        try {
            const isValid = Object.values(AspectRatioImage).includes(aspectRatio as AspectRatioImage)
            if (!isValid) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: `Invalid aspect ratio. Valid options: ${Object.keys(AspectRatioImage).join(', ')}`,
                    errorType: 'INVALID_ASPECT_RATIO'
                }, HttpStatus.BAD_REQUEST)
            }

            const input = {
                prompt,
                aspect_ratio: aspectRatio,
                output_format: "webp",
        
            }

            let prediction = await this.multimediaClient.predictions.create({
                model: this.imageModel,
                input
            })
            
            prediction = await this.multimediaClient.wait(prediction);
            
            if (prediction.status !== 'succeeded') {
                throw new MultimediaGeneratorError(
                    'Image generation failed ',
                    MultimediaErrorTypes.PREDICTION_FAILED,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
            
            const outputArray = prediction.output as string[];
            const imageUrl: string | undefined = Array.isArray(outputArray) ? outputArray[0] : undefined
            
            if (!imageUrl) {
                throw new MultimediaGeneratorError(
                    'No image URL in response',
                    MultimediaErrorTypes.MISSING_OUTPUT,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
            
            return imageUrl
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
    async createRemixBasedImage(imageUrl: string, prompt: string): Promise<string> {
        try {
            const input = {
                image_url: imageUrl, // URL pública de tu imagen
                prompt: prompt,
                guidance_scale: 7.5, // Controla qué tan fuerte sigue el prompt
                num_inference_steps: 28, 
                output_format: "webp"
            }
            let prediction = await this.multimediaClient.predictions.create({
                model: this.imageRemixModel,
                input
            })
            
            prediction = await this.multimediaClient.wait(prediction);
            
            if (prediction.status !== 'succeeded') {
                throw new MultimediaGeneratorError(
                    'Unexpected error when generating image',
                    MultimediaErrorTypes.PREDICTION_FAILED,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
            
            const outputArray = prediction.output as string[];
            const remixedImageUrl: string | undefined = Array.isArray(outputArray) ? outputArray[0] : undefined
            
            if (!remixedImageUrl) {
                throw new MultimediaGeneratorError(
                    'Unexpected error when generating url image',
                    MultimediaErrorTypes.MISSING_OUTPUT,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            }
            
            return remixedImageUrl
        } catch (error:unknown) {
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
}