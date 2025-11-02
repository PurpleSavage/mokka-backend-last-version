import { Controller } from "@nestjs/common";

@Controller({
  path:'audio/write',
  version:'1'
})
export class AudioCommandController{
  constructor(){}
}