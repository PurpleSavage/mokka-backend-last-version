import { VideoAspectRatio } from "../enums/video-aspectratio";

export class GeneratedVideoVO{
    private constructor(
        readonly user: string,
        readonly prompt: string,
        readonly width: number,
        readonly height: number,
        readonly videoUrl:string,
        readonly aspectRatio:VideoAspectRatio,
        readonly audio:boolean,
        readonly referenceImages?:string[]
    ){}

    static create(props:{
        user: string,
        prompt: string,
        width: number,
        height: number,
        videoUrl:string,
        aspectRatio:VideoAspectRatio,
        audio:boolean
        referenceImages?:string[]
    }):GeneratedVideoVO{
        return new GeneratedVideoVO(
            props.user,
            props.prompt,
            props.width,
            props.height,
            props.videoUrl,
            props.aspectRatio,
            props.audio,
            props.referenceImages
        )
    }

}