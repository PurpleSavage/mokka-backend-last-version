import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { DownloadFilePort } from "src/shared/application/ports/downlaod-file.port";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "../enums/error-detail-types";

@Injectable()
export class DownloadFileService implements DownloadFilePort{
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
                throw new MokkaError({
                    message: 'File too large (max 100MB)',
                    errorType: ErrorPlatformMokka.FILE_SIZE_ERROR,
                    status: HttpStatus.PAYLOAD_TOO_LARGE,
                    details: 'File size exceeds maximum allowed'
                })
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
                    throw new MokkaError({
                        message: 'timeout',
                        errorType: ErrorPlatformMokka.DOWNLOAD_TIMEOUT_ERROR,
                        status: HttpStatus.PAYLOAD_TOO_LARGE,
                        details: 'Download timeout (30 seconds exceeded)'
                    })
                }

                if (error.response) {
                    throw new MokkaError({
                        message: 'failed http',
                        errorType: ErrorPlatformMokka.HTTP_ERROR,
                        status: HttpStatus.PAYLOAD_TOO_LARGE,
                        details: `HTTP error! status: ${error.response.status}`
                    })
                }
            }

            // Error genérico
            throw new MokkaError({
                message: 'An error occurred while downloading video, please try again later.',
                errorType: ErrorPlatformMokka.DOWNLOAD_ERROR,
                status: HttpStatus.PAYLOAD_TOO_LARGE,
                details: 'An error occurred while downloading video, unknow error.'
            })
        }
    }
}