import {  HttpStatus, Injectable } from "@nestjs/common";
import { AuthPort } from "../ports/auth.port";
import { LoginWithCredentialsDto } from "../dtos/login-with-credentials.dto";
import { HashPort } from "../ports/hash.port";
import { JwtPort } from "src/shared/common/application/ports/jwt.port";
import { Session } from "../types/session-response";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";

@Injectable()
export class LoginWithCredentialsUseCase{
    constructor(
        private readonly authQueryService:AuthPort,
        private readonly hashService:HashPort,
        private readonly jwtService:JwtPort
    ){}
    async execute(loginWithCredentialsDto:LoginWithCredentialsDto):Promise<Session>{
        const user = await this.authQueryService.findUserByEmail(loginWithCredentialsDto.email)
        if(!user){
            throw new MokkaError({
                message: 'User does not exist or invalid credentials',
                errorType: ErrorPlatformMokka.MOKKA_ERROR,
                status: HttpStatus.NOT_FOUND,
                details: 'User does not exist or invalid credentials'
            })
        }
        if(!user.password){
            throw new MokkaError({
                message: 'Invalid credentials',
                errorType: ErrorPlatformMokka.MOKKA_ERROR,
                status: HttpStatus.CONFLICT,
                details: 'User does not exist or invalid credentials'
            })
        }
        const userValid = await this.hashService.compare(loginWithCredentialsDto.password,user.password)
        if(!userValid){
            throw new MokkaError({
                message: 'Invalid credentials',
                errorType: ErrorPlatformMokka.MOKKA_ERROR,
                status: HttpStatus.CONFLICT,
                details: 'User does not exist or invalid credentials'
            })
        }
        const token = await this.jwtService.generateToken({ email: user.email},'1h')
        if(!token){
            throw new MokkaError({
                message: 'An error occurred while creating session, please try again later.',
                errorType: ErrorPlatformMokka.MOKKA_ERROR,
                status: HttpStatus.CONFLICT,
                details: 'An error occurred while creating session token'
            })
        }
        return {
            access_token:token,
            user:{
                email:user.email,
                id:user.id,
                credits:user.credits,
                createDate:user.createDate,
                refresh_token:user.refreshtoken
            }
        }
    }
}