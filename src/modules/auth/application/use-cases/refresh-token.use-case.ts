import { JwtPort } from "src/shared/common/application/ports/jwt.port";
import { AccessToken } from "../types/access-token";
import { RefreshTokenDto } from "../dtos/refresh-token.dto";
import { HttpStatus, Injectable } from "@nestjs/common";
import { MokkaError } from "src/shared/errors/mokka.error";

@Injectable()
export class RefreshTokenUseCase{
    constructor(
        private readonly jwtService:JwtPort
    ){}
    async execute(refreshTokenDto:RefreshTokenDto):Promise<AccessToken>{
        const access_token = await this.jwtService.generateToken({ email:refreshTokenDto.email},'15m')
        if(!access_token){
            throw new MokkaError({
                message: 'An error occurred while creating new session, please try again later.',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Failed to generate access token'
            })
        }
        return {
            access_token
        }
    }
}