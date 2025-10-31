import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Session } from "../types/session-response";
import { AuthPort } from "../ports/auth.port";
import { JwtPort } from "src/shared/application/ports/jwt.port";


@Injectable()
export class GetProfileUseCase{
    constructor(
        private readonly authQueryService:AuthPort,
        private readonly jwtService:JwtPort
    ){}
    async execute(email:string):Promise<Session>{
        const user = await this.authQueryService.findUserByEmail(email)
        if(!user){
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error:'This email address is already in use, please try another one.',
                errorType:'Mokka_ERROR'
            },HttpStatus.NOT_FOUND)
        }
        const access_token = await this.jwtService.generateToken({email:user.email},'15m')
        if(!access_token){
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error:'An error occurred while creating the account, please try again later.',
                errorType:'Mokka_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR)
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