import { MusicEntity } from "../entities/music.entity";
import { GeneratedMusicVO } from "../value-objects/generated-music.vo";

export abstract class MusicRepository{
    abstract saveSong(vo:GeneratedMusicVO):Promise<MusicEntity>
}