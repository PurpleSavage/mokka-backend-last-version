import { Global, Module } from "@nestjs/common";
import { JwtPort } from "./application/ports/jwt.port";
import { JwtAuthService } from "./infrastructure/adapters/jwt.service";


@Global() 
@Module({

    providers:[
        {
            useClass:JwtAuthService,
            provide:JwtPort
        }
    ],
    exports:[
        JwtPort
    ]
})
export class SharedModule{}