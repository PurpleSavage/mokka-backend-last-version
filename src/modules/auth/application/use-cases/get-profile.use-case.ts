import {  HttpStatus, Injectable } from "@nestjs/common";
import { Session } from "../types/session-response";
import { AuthPort } from "../ports/auth.port";
import { JwtPort } from "src/shared/common/application/ports/jwt.port";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/common/infrastructure/enums/error-detail-types";


@Injectable()
export class GetProfileUseCase{
    constructor(
        private readonly authQueryService:AuthPort,
        private readonly jwtService:JwtPort
    ){}
    async execute(email:string):Promise<Session>{
        const user = await this.authQueryService.findUserByEmail(email)
        if(!user){
            throw new MokkaError({
                message: 'User does not exist or invalid credentials',
                errorType: ErrorPlatformMokka.MOKKA_ERROR,
                status: HttpStatus.NOT_FOUND,
                details: 'User does not exist or invalid credentials'
            })
        }
        const access_token = await this.jwtService.generateToken({email:user.email},'1m')
        if(!access_token){
            throw new MokkaError({
                message: 'User does not exist or invalid credentials',
                errorType: ErrorPlatformMokka.MOKKA_ERROR,
                status: HttpStatus.NOT_FOUND,
                details: 'User does not exist or invalid credentials'
            })
        }
        return {
            access_token,
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