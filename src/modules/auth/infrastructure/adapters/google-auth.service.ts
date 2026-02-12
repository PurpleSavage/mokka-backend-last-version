import {  HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from 'google-auth-library'; 
import { GooglePort } from "../../application/ports/google.port";
import { GoogleUserData } from "../types/google-response";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";
import { PinoLogger } from "nestjs-pino";
@Injectable()
export class GoogleAuthService implements GooglePort{
    private readonly client: OAuth2Client;
    constructor(
        private configService: ConfigService,
        private readonly logger: PinoLogger
    ){
        const googleClientId= this.configService.get<string>('GOOGLE_CLIENT_ID')
        const googleClientIdSecret= this.configService.get<string>('GOOGLE_CLIENT_SECRET')
        this.client= new OAuth2Client(
            googleClientId,
            googleClientIdSecret
        )
    }
    async verifyToken(googleToken: string): Promise<GoogleUserData> {
        try {
        // Verificar el token con Google Auth Library
        const ticket = await this.client.verifyIdToken({
            idToken: googleToken,
            audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        });

        const payload = ticket.getPayload();
        
        if (!payload) {
            throw new MokkaError({
                message: 'Error to login account',
                errorType: ErrorPlatformMokka.GOOGLE_UNAUTHORIZED,
                status: HttpStatus.UNAUTHORIZED,
                details: 'Invalid Google token payload'
            })
                        
        }

        // Extraer datos del usuario
        return {
            email: payload.email!,
            googleId: payload.sub,
            name: payload.name!,
            picture: payload.picture,
        };
        } catch (error) {
            this.logger.error(
                { 
                    stack: error instanceof Error ? error.stack : undefined, 
                    message: 'GoogleAuth failed' 
                }, 
                'Google token verification failed'
            );
            throw new MokkaError({
                message: 'Error to login account',
                errorType: ErrorPlatformMokka.GOOGLE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Failed server to validate token'
            })
        }
    }
}