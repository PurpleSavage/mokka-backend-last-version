import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { HashPort } from "../../application/ports/hash.port";
import { JwtPort } from "src/shared/application/ports/jwt.port";
import { UserDocument } from "../schemas/user.schema";
import { Model } from "mongoose";
import { TypeAuth } from "../../domain/enums/type-auth";


@Injectable()
export class AuthCommandService implements AuthRepository{
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        private readonly jwtAuthService: JwtPort,
        @Inject(HashPort) private readonly argonService: HashPort
    ){}
    async createAccount(email: string, password: string): Promise<UserEntity> {
        try {
            const hashedPassword = await this.argonService.hash(password)
            const refreshtoken = await this.jwtAuthService.generateToken({email},'48h')
            if(!refreshtoken) {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error:'failed server to generate token',
                    errorType:'Mokka_ERROR'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
            const userInstance = new this.userModel({
                email,
                password: hashedPassword,
                refreshtoken, 
                typeAuth: TypeAuth.CREDENTIALS,
                credits:300 
            })
            const savedUser = await userInstance.save();
            const newUser = new UserEntity()
            .setId(savedUser._id.toString())
            .setEmail(savedUser.email)
            .setCredits(savedUser.credits)
            .setCreateDate(savedUser.createdAt)
            .setRefreshToken(savedUser.refreshtoken)
            .setTypeAuth(savedUser.typeAuth)
            .setPassword(savedUser.password)
            .build()

            return newUser
        } catch (error) {
            console.log(error)
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error:'Invalid credentials',
                errorType:'Mokka_ERROR'
            },HttpStatus.CONFLICT)
        }
    }
    async googleAuthCreateAccount(email:string): Promise<UserEntity> {
        try {
            const refreshtoken = await this.jwtAuthService.generateToken({ email }, '48h')
            if(!refreshtoken) {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error:'failed server to generate token',
                    errorType:'Mokka_ERROR'
                },HttpStatus.INTERNAL_SERVER_ERROR)
            }
             const userInstance = new this.userModel({
                email,
                typeAuth: TypeAuth.GOOGLE,
                refreshtoken,  
                typePlan: 'FREE', 
            })
            const savedUser = await userInstance.save()
            const newUser = new UserEntity()
            .setId(savedUser._id.toString())
            .setEmail(savedUser.email)
            .setCredits(savedUser.credits)
            .setCreateDate(savedUser.createdAt)
            .setRefreshToken(savedUser.refreshtoken)
            .setTypeAuth(savedUser.typeAuth)
            .build()

            return newUser
        } catch (error) {
            console.log(error)
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'An error occurred while creating the account, please try again later.',
                errorType:'Mokka_ERROR'
            },HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}