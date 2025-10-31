import { Module } from "@nestjs/common";
import { AuthCommandController } from "./auth-command.controller";
import { AuthQueryController } from "./auth-query.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { SharedModule } from "src/shared/shared.module";
import { UserSchema } from "./infrastructure/schemas/user.schema";
import { AuthRepository } from "./domain/repositories/auth.repository";
import { AuthPort } from "./application/ports/auth.port";
import { GooglePort } from "./application/ports/google.port";
import { AuthCommandService } from "./infrastructure/adapters/auth-command.service";
import { AuthQueryService } from "./infrastructure/adapters/auth-query.service";
import { HashPort } from "./application/ports/hash.port";
import { LoginWithCredentialsUseCase } from "./application/use-cases/login-crendetials.use-case";
import { GoogleAuthService } from "./infrastructure/adapters/google-auth.service";
import { LoginWithGoogleUseCase } from "./application/use-cases/login-with-google.use-case";
import { CreateAccountWithCredentialsUseCase } from "./application/use-cases/create-account-with-credemtails.use-case";
import { RefreshTokenUseCase } from "./application/use-cases/refresh-token.use-case";
import { GetProfileUseCase } from "./application/use-cases/get-profile.use-case";

@Module({
    imports:[
        SharedModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    providers:[
        LoginWithCredentialsUseCase,
        LoginWithGoogleUseCase,
        CreateAccountWithCredentialsUseCase,
        RefreshTokenUseCase,
        GetProfileUseCase,
        {
            provide:AuthRepository,
            useClass:AuthCommandService
        },
        {

            provide:AuthPort,
            useClass:AuthQueryService
        },
        {
            provide:GooglePort,
            useClass:GoogleAuthService
        }
    ],
    controllers:[
        AuthCommandController,
        AuthQueryController
    ],
    exports:[
        AuthRepository,
        AuthPort,
        GooglePort,
        HashPort
    ]
})
export class AuthModule{}