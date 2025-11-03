import { Global, Module } from "@nestjs/common";
import { NotifierService } from "./notifier.service";
import { NotifierGateway } from "./notifier.gateway";

@Global()
@Module({
    providers:[
        NotifierService,
        NotifierGateway
    ],
    exports: [NotifierService] 
})
export class NotifierModule{}