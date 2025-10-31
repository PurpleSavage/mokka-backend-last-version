import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { AuthPort } from "../ports/auth.port";
import { LoginWithCredentialsDto } from "../dtos/login-with-credentials.dto";
import { JwtPort } from "src/shared/application/ports/jwt.port";
import { Session } from "../types/session-response";

@Injectable()
export class CreateAccountWithCredentialsUseCase{
    constructor(
        private readonly authCommandService:AuthRepository,
        private readonly authQueryService:AuthPort,
        private readonly jwtService:JwtPort
    ){}
    async execute(loginWithCredentialsDto:LoginWithCredentialsDto):Promise<Session>{
        const userExist = await this.authQueryService.findUserByEmail(loginWithCredentialsDto.email)
        if(userExist){
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error:'This email address is already in use, please try another one.',
                errorType:'Mokka_ERROR'
            },HttpStatus.CONFLICT)
        }
        const userCreated=  await this.authCommandService.createAccount(loginWithCredentialsDto.email,loginWithCredentialsDto.password)
        const token = await this.jwtService.generateToken({ email:userCreated.email },'15m')
        if(!token){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error:'An error occurred while creating the account, please try again later.',
                errorType:'Mokka_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return {
            access_token:token,
            user:{
                email:userCreated.email,
                id:userCreated.id,
                credits:userCreated.credits,
                createDate:userCreated.createDate,
                refresh_token:userCreated.refreshtoken
            }
        }
    }
}