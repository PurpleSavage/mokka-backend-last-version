import { VideoAspectRatio } from "../../../../shared/domain/enums/video-aspectratio";

export class GeneratedVideoVO{
    private constructor(
        readonly user: string,
        readonly prompt: string,
        readonly videoUrl:string,
        readonly aspectRatio:VideoAspectRatio,
        readonly audio:boolean,
        readonly referenceImages?:string[]
    ){}

    static create(props:{
        user: string,
        prompt: string,
        videoUrl:string,
        aspectRatio:VideoAspectRatio,
        audio:boolean
        referenceImages?:string[]
    }):GeneratedVideoVO{
        return new GeneratedVideoVO(
            props.user,
            props.prompt,
            props.videoUrl,
            props.aspectRatio,
            props.audio,
            props.referenceImages
        )
    }

}