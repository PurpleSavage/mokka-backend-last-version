import type{ AudioEntity } from "../../domain/entities/audio.entity";

export abstract class AudioPort{
    abstract listAudios(idUser:string):Promise<AudioEntity[]>
}