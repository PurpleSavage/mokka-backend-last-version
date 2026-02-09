import { JwtPort } from "src/shared/application/ports/jwt.port";
import { AuthPort } from "../../application/ports/auth.port";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserDocument } from "src/shared/infrastructure/schemas/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class AuthQueryService implements AuthPort{
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        private readonly jwtAuthService: JwtPort,
    ){}
    async findUserByEmail(email: string): Promise<UserEntity | null> {
        try {
            const userExist = await this.userModel.findOne({ email }).exec()
            if(!userExist) return null
            const newRefreshToken = await this.jwtAuthService.generateToken({email},'48h')
            if(!newRefreshToken){
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'An error occurred while generating the session, please try again later.',
                    errorType:'Mokka_ERROR'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
            const updatedUser = await this.userModel.findOneAndUpdate(
                { email }, 
                { refreshtoken: newRefreshToken }, 
                { new: true }
            ).exec()
            if (!updatedUser) {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Falide to satrt session',
                    errorType:'Mokka_ERROR'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
            const user = new UserEntity()
            .setId(updatedUser._id.toString())
            .setEmail(updatedUser.email)
            .setCredits(updatedUser.credits)
            .setCreateDate(updatedUser.createdAt)
            .setRefreshToken(updatedUser.refreshtoken)
            .setTypeAuth(updatedUser.typeAuth)
            .build()
            return user
        } catch (error) {
            console.log(error)
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred, please try again later.',
                errorType:'Mokka_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
}