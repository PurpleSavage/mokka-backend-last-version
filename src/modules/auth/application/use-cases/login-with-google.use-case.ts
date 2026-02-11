import {  HttpStatus, Injectable } from "@nestjs/common";
import { AuthPort } from "../ports/auth.port";
import { JwtPort } from "src/shared/application/ports/jwt.port";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { GooglePort } from "../ports/google.port";
import { LoginWithGoogleDto } from "../dtos/login-with-google.dto";
import { Session } from "../types/session-response";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";

@Injectable()
export class LoginWithGoogleUseCase{
    constructor(
        private readonly authQueryService:AuthPort,
        private readonly authCommandService:AuthRepository,
        private readonly jwtService:JwtPort,
        private readonly googleService:GooglePort
    ){}
    async execute(loginWithGoogleDto:LoginWithGoogleDto):Promise<Session>{
        const userAuthenticated = await this.googleService.verifyToken(loginWithGoogleDto.googleToken)
        const userExist = await this.authQueryService.findUserByEmail(userAuthenticated.email)
        const token = await this.jwtService.generateToken({ email:userAuthenticated.email },'15m')
        if(!token){
            throw new MokkaError({
                message: 'failed server',
                errorType: ErrorPlatformMokka.UNKNOWN_ERROR,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'An error occurred while creating the account, please try again later.'
            })
            
        }
        if(userExist){
            return {
                access_token:token,
                user:{
                    email:userExist.email,
                    id:userExist.id,
                    credits:userExist.credits,
                    createDate:userExist.createDate,
                    refresh_token:userExist.refreshtoken
                }
            }
        }
        const userCreated = await this.authCommandService.googleAuthCreateAccount(userAuthenticated.email)
        return {
            access_token:token,
            user:{
                email:userCreated .email,
                id:userCreated .id,
                credits:userCreated .credits,
                createDate:userCreated .createDate,
                refresh_token:userCreated .refreshtoken
            }
        }
                
    }
}