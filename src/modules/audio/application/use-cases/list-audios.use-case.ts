import { Injectable } from "@nestjs/common";
import { ListAudiosDto } from "../dtos/list-audios.dto";
import { AudioPort } from "../ports/audio.port";
import { AudioEntity } from "../../domain/entities/audio.entity";

@Injectable()
export class ListAudiosUseCase{
    constructor(
        private readonly audioQueryService:AudioPort
    ){}
    async execute(dto:ListAudiosDto):Promise<AudioEntity[]>{   
        return await this.audioQueryService.listAudios(dto.idUser)
    }
}