

export class SaveSceneInfluencerVo{
    constructor(
        public readonly urlScene:string,
        public readonly prompt:string,
        public readonly user:string,
        public readonly influencer:string,
        public readonly volume:boolean,
        public readonly duration:number,
    ){
         Object.freeze(this);
    }
    create(props:{
        urlScene:string,
        prompt:string,
        influencer:string,
        volume:boolean,
        duration:number,
        user:string
    }): SaveSceneInfluencerVo{
        return new SaveSceneInfluencerVo(
            props.urlScene,
            props.prompt,
            props.user,
            props.influencer,
            props.volume,
            props.duration
        )
    }
}