import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config";
import { SupabaseImageResponse, SupabaseResponse, SupabaseVideoResponse } from "src/shared/common/domain/types/supabase-types";
import { PathStorageType } from "src/shared/common/domain/enums/path-storage";
import { StorageRepository } from "../../domain/repositories/storage.repository";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PinoLogger } from "nestjs-pino";
@Injectable()
export class StorageService implements StorageRepository {
    private s3Client: S3Client;
    private bucketName: string;
    private publicUrlBase: string;

    constructor(
        private configService: ConfigService,
         private readonly logger: PinoLogger
    ) {
        const accountId = this.configService.get<string>('R2_ACCOUNT_ID')!;
        const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID')!;
        const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY')!;
        
        this.bucketName = this.configService.get<string>('R2_BUCKET_NAME')!;
    
        this.publicUrlBase = this.configService.get<string>('R2_PUBLIC_URL')!;

        this.s3Client = new S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    private generateId() {
        const random = Math.random().toString(32).substring(2);
        const fecha = Date.now().toString(32);
        return random + fecha;
    }

    private calculateSizeFile(bytes: number) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const size = bytes / Math.pow(k, i);
        const formattedSize = i === 0 ? size.toString() : size.toFixed(2);
        return `${formattedSize} ${sizes[i]}`;
    }

    // Método genérico para subir a R2 
    private async uploadToR2(filePath: string, buffer: Buffer, contentType: string): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: filePath,
                Body: buffer,
                ContentType: contentType,
            });

            await this.s3Client.send(command);
            
            return `${this.publicUrlBase}/${filePath}`;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;

            this.logger.error({
                msg: 'Error uploading file to Cloudflare R2',
                filePath,
                contentType,
                error: errorMessage,
                stack: errorStack,
            });
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: `An error occurred while saving the file`,
                errorType: 'Storage_ERROR'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async saveAudio(idUser: string, buffer: Buffer, path: PathStorageType): Promise<SupabaseResponse> {
        const filename = `${idUser}-${this.generateId()}.mp3`;
        const filePath = `multimedia/${path}/${filename}`;
        
        const url = await this.uploadToR2(filePath, buffer, 'audio/mpeg');
        
        return { url };
    }

    async saveImage(bufferImage: Buffer, userId: string, path: PathStorageType): Promise<SupabaseImageResponse> {
        const filename = `${userId}-${this.generateId()}.png`;
        const size = this.calculateSizeFile(bufferImage.length);
        const filePath = `multimedia/${path}/${filename}`;

        const url = await this.uploadToR2(filePath, bufferImage, 'image/png');

        return { url, size };
    }

    async saveVideo(idUser: string, bufferVideo: Buffer, path: PathStorageType): Promise<SupabaseVideoResponse> {
        const filename = `${idUser}-${this.generateId()}.mp4`;
        const filePath = `multimedia/${path}/${filename}`;

        const url = await this.uploadToR2(filePath, bufferVideo, 'video/mp4');

        return { url };
    }
}