import { Controller } from "@nestjs/common";


@Controller({
    path:'video/read',
    version:'1'
})
export class VideoQueryController{
    constructor(){}
}