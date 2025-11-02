import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Replicate, { Prediction } from "replicate";
import { MultimediaGeneratorPort } from "src/shared/application/ports/multimedia-generator.port";

@Injectable()
export class MultimediaService implements MultimediaGeneratorPort{
    private videoModel = "google/veo-3"
    private imageModel="google/imagen-4-fast"
    private readonly multimediaClient: Replicate

    constructor(private readonly configService:ConfigService){
        const token = this.configService.get<string>('REPLICATE_API_TOKEN');
        if (!token) {
            throw new Error('REPLICATE_API_TOKEN is not configured.');
        }

        this.multimediaClient = new Replicate({
            auth: token,
        });
      
    }
    async createVideo(aspectRatio: string,prompt: string): Promise<string> {
        
        try {
            let prediction: Prediction
            const input = {
                prompt, 
                duration: 5,
                aspect_ratio: aspectRatio
            }
            prediction = await this.multimediaClient.predictions.create({
                model:this.videoModel,
                input
           }) 
           prediction = await this.multimediaClient.wait(prediction)
            if (prediction.status !== 'succeeded') {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'An error occurred while creating video, please try again later.',
                    errorType:'Replicate_ERROR'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
            const outputArray = prediction.output as string[]
            
            const videoUrl: string | undefined = Array.isArray(outputArray) ? outputArray[0] : undefined;

            if (!videoUrl) {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'An error occurred while creating url video, please try again later.',
                    errorType:'Replicate_ERROR'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return videoUrl
        } catch (error) {
            console.log(error)
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while creating video, please try again later.',
                errorType:'Replicate_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    async createImage(aspectRatio: string, prompt: string): Promise<string> {
        try {
            let prediction: Prediction
            const input = {
                prompt, 
                duration: 5,
                aspect_ratio: aspectRatio,
                output_format:"webp"
            }
            prediction = await this.multimediaClient.predictions.create({
                model:this.imageModel,
                input
            })
            prediction = await this.multimediaClient.wait(prediction)
            const outputArray = prediction.output as string[]
            const videoUrl: string | undefined = Array.isArray(outputArray) ? outputArray[0] : undefined;

            if (!videoUrl) {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'An error occurred while creating url Image, please try again later.',
                    errorType:'Replicate_ERROR'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
            return videoUrl
        } catch (error) {
            console.log(error)
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while creating image, please try again later.',
                errorType:'Replicate_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}