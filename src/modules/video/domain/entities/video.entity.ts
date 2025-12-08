import { VideoAspectRatio } from "../enums/video-aspectratio"

export class VideoEntity{
    private id: string
    private videoUrl:string
    private prompt:string
    private height:number
    private width:number
    private createDate:Date
    private aspectRatio:VideoAspectRatio
    
    constructor(){}
    
     setId(id: string){
        this.id = id
        return this
    }
    
    setVideoUrl(videoUrl: string){
        this.videoUrl = videoUrl
        return this
    }
    
    setPrompt(prompt: string){
        this.prompt = prompt
        return this
    }
    
    setHeight(height: number){
        this.height = height
        return this
    }
    
    setWidth(width: number){
        this.width = width
        return this
    }
    
    setCreateDate(createDate: Date){
        this.createDate = createDate
        return this
    }
    
    setAspectRatio(aspectRatio: VideoAspectRatio){
        this.aspectRatio = aspectRatio
        return this
    }

    build(){
        return this
    }
}