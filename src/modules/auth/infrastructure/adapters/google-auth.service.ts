import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OAuth2Client } from 'google-auth-library'; 
import { GooglePort } from "../../application/ports/google.port";
import { GoogleUserData } from "../types/google-response";
@Injectable()
export class GoogleAuthService implements GooglePort{
    private readonly client: OAuth2Client;
    constructor(private configService: ConfigService){
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
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        if (!payload) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error:'Invalid Google token payload',
                errorType:'Google_ERROR'
            },HttpStatus.UNAUTHORIZED)
        }

        // Extraer datos del usuario
        return {
            email: payload.email!,
            googleId: payload.sub,
            name: payload.name!,
            picture: payload.picture,
        };
        } catch (error) {
            console.error('Google token verification failed:', error)
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error:'Invalid Google token payload',
                errorType:'Google_ERROR'
            },HttpStatus.UNAUTHORIZED)
        }
    }
}