import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthPort } from "../ports/auth.port";
import { LoginWithCredentialsDto } from "../dtos/login-with-credentials.dto";
import { HashPort } from "../ports/hash.port";
import { JwtPort } from "src/shared/application/ports/jwt.port";
import { Session } from "../types/session-response";

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
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error:'User does not exist or invalid credentials',
                errorType:'Mokka_ERROR'
            },HttpStatus.UNAUTHORIZED)
        }
        if(!user.password){
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error:'Invalid credentials',
                errorType:'Mokka_ERROR'
            },HttpStatus.CONFLICT)
        }
        const userValid = await this.hashService.compare(loginWithCredentialsDto.password,user.password)
        if(!userValid){
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error:'Invalid credentials',
                errorType:'Mokka_ERROR'
            },HttpStatus.CONFLICT)
        }
        const token = await this.jwtService.generateToken({ email: user.email},'15m')
        if(!token){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error:'An error occurred while creating session, please try again later.',
                errorType:'Mokka_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR)
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