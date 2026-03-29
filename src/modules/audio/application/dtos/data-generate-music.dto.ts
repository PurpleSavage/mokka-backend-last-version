export class DataGenerateMusicDto{
    constructor(
        public readonly promptBasedMdFile:string,
        public readonly user:string,
        public readonly durationMs:number,
        public readonly forceInstrumental:boolean
    ){}
    toDot(data:{
        newPrompt:string,
        user:string,
        durationMs:number,      
        forceInstrumental:boolean
    }):DataGenerateMusicDto{
        return new DataGenerateMusicDto(
            data.newPrompt,
            data.user,
            data.durationMs,
            data.forceInstrumental
        )
    }
}