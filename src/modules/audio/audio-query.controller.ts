import { Controller } from "@nestjs/common";

@Controller({
    path:'audio/read',
    version:'1'
})
export class AudioQueryController{
    constructor(){}
}