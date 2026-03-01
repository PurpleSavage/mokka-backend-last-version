import { VideoAspectRatio } from "../../../../shared/domain/enums/video-aspectratio"

export class VideoEntity{
    private id: string
    private videoUrl:string
    private prompt:string 
    private createDate:Date
    private aspectRatio:VideoAspectRatio
    private audio:boolean

    
    constructor(){}
    
    setId(id: string){
        this.id = id
        return this
    }
    setAudio(audio:boolean){
        this.audio = audio 
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
    
  
    
    setCreateDate(createDate: Date){
        this.createDate = createDate
        return this
    }
    
    setAspectRatio(aspectRatio: VideoAspectRatio){
        this.aspectRatio = aspectRatio
        return this
    }
   
    getId(): string {
        return this.id
    }
    
    getVideoUrl(): string {
        return this.videoUrl
    }
    
    getPrompt(): string {
        return this.prompt
    }
    getAudio(){
        return this.audio
    }
   
    
    getCreateDate(): Date {
        return this.createDate
    }
    
    getAspectRatio(): VideoAspectRatio {
        return this.aspectRatio
    }
    

    build(){
        return this
    }
}