import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { HashPort } from "../../application/ports/hash.port";
import { JwtPort } from "src/shared/application/ports/jwt.port";
import { UserDocument } from "src/shared/infrastructure/schemas/user.schema";
import { Model } from "mongoose";
import { TypeAuth } from "../../../../shared/domain/enums/type-auth";
import { PinoLogger } from "nestjs-pino";
import { MokkaError } from "src/shared/errors/mokka.error";
import { ErrorPlatformMokka } from "src/shared/infrastructure/enums/error-detail-types";


@Injectable()
export class AuthCommandService implements AuthRepository{
    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        private readonly jwtAuthService: JwtPort,
        @Inject(HashPort) private readonly argonService: HashPort,
        private readonly logger: PinoLogger
    ){}
    async createAccount(email: string, password: string): Promise<UserEntity> {
        try {
            const hashedPassword = await this.argonService.hash(password)
            const refreshtoken = await this.jwtAuthService.generateToken({email},'48h')
            if(!refreshtoken) {
                throw new MokkaError({
                    message: 'failed server',
                    errorType: ErrorPlatformMokka.UNKNOWN_ERROR,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    details: 'failed server to generate token'
                })
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
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"Error creating account"
                },
                'Error creating account'
            )
            throw new MokkaError({
                message: 'Error creating account',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
                
        }
    }
    async googleAuthCreateAccount(email:string): Promise<UserEntity> {
        try {
            const refreshtoken = await this.jwtAuthService.generateToken({ email }, '48h')
            if(!refreshtoken) {
                throw new MokkaError({
                    message: 'failed server',
                    errorType: ErrorPlatformMokka.UNKNOWN_ERROR,
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    details: 'failed server to generate token'
                })
            
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
            this.logger.error(
                {
                    stack: error instanceof Error ? error.stack : undefined,
                    message:"An error occurred while creating the account, please try again later."
                },
                'An error occurred while creating the account'
            )
            throw new MokkaError({
                message: 'An error occurred while creating the account, please try again later.',
                errorType: ErrorPlatformMokka.DATABASE_FAILED,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                details: 'Database operation failed'
            })
        }
    }
}