import { Controller } from "@nestjs/common";

@Controller({
    path:'video/write',
    version:'1'
})
export class VideoCommandController{
    constructor(){}
}