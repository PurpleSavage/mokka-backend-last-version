export abstract class MusicPort{
    abstract listSongsGenerated():Promise<void>
    abstract getSongByid(id:string):Promise<void>
}