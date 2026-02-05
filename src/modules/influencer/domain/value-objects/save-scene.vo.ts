import { VideoAspectRatio } from "src/shared/domain/enums/video-aspectratio";



export class SaveSceneInfluencerVo{
    constructor(
        public readonly urlScene:string,
        public readonly prompt:string,
        public readonly user:string,
        public readonly influencer:string,
        public readonly volume:boolean,
        public readonly imageBaseUrls:string[],
        public readonly aspectRatio:VideoAspectRatio
        
    ){
        Object.freeze(this);
    }
    static create(props:{
        urlScene:string,
        prompt:string,
        influencer:string,
        volume:boolean,
        user:string,
        imageBaseUrls:string[],
        aspectRatio:VideoAspectRatio
    }): SaveSceneInfluencerVo{
        return new SaveSceneInfluencerVo(
            props.urlScene,
            props.prompt,
            props.user,
            props.influencer,
            props.volume,
            props.imageBaseUrls,
            props.aspectRatio
        )
    }
}