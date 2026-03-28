import { JwtPort } from "src/shared/common/application/ports/jwt.port";
import { AccessToken } from "../types/access-token";
import { HttpStatus, Injectable } from "@nestjs/common";
import { MokkaError } from "src/shared/errors/mokka.error";

@Injectable()
export class RefreshTokenUseCase{
    constructor(
        private readonly jwtService:JwtPort
    ){}
    async execute(email:string):Promise<AccessToken>{
        const access_token = await this.jwtService.generateToken({ email:email},'1m')
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