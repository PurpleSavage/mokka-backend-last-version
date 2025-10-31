import { JwtPort } from "src/shared/application/ports/jwt.port";
import { AccessToken } from "../types/access-token";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class RefreshTokenUseCase{
    constructor(
        private readonly jwtService:JwtPort
    ){}
    async execute(refreshTokenDto:RefreshTokenDto):Promise<AccessToken>{
        const access_token = await this.jwtService.generateToken({ email:refreshTokenDto.email},'15m')
        if(!access_token){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error:'An error occurred while creating new session, please try again later.',
                errorType:'Mokka_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return {
            access_token
        }
    }
}