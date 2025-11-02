import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

@Injectable()
export class DownloadVideoUseCase {
    constructor(private readonly httpService: HttpService) {}

    async downloadUrl(url: string): Promise<Buffer> {
        try {
            const { data, headers } = await this.httpService.axiosRef.get<Buffer>(url, {
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; VideoDownloader/1.0)'
                },
                timeout: 30000,
                maxContentLength: 100 * 1024 * 1024,
                maxBodyLength: 100 * 1024 * 1024
            });

            const contentLength= headers['content-length'] as string | undefined;
            
            if (contentLength && parseInt(contentLength) > 100 * 1024 * 1024) {
                throw new HttpException({
                    status: HttpStatus.PAYLOAD_TOO_LARGE,
                    error: 'File too large (max 100MB)',
                    errorType: 'FILE_SIZE_ERROR'
                }, HttpStatus.PAYLOAD_TOO_LARGE);
            }

            return Buffer.from(data);

        } catch (error) {
            console.error('Error downloading video:', error);

            // Si ya es un HttpException, re-lanzarlo
            if (error instanceof HttpException) {
                throw error;
            }

            // Manejar errores de Axios
            if (error instanceof AxiosError) {
                if (error.code === 'ECONNABORTED') {
                    throw new HttpException({
                        status: HttpStatus.REQUEST_TIMEOUT,
                        error: 'Download timeout (30 seconds exceeded)',
                        errorType: 'DOWNLOAD_TIMEOUT_ERROR'
                    }, HttpStatus.REQUEST_TIMEOUT);
                }

                if (error.response) {
                    throw new HttpException({
                        status: HttpStatus.BAD_GATEWAY,
                        error: `HTTP error! status: ${error.response.status}`,
                        errorType: 'HTTP_ERROR'
                    }, HttpStatus.BAD_GATEWAY);
                }
            }

            // Error genérico
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while downloading video, please try again later.',
                errorType: 'DOWNLOAD_ERROR'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}