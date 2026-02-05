import { VideoAspectRatio } from "../../../../shared/domain/enums/video-aspectratio"

export class VideoEntity{
    private id: string
    private videoUrl:string
    private prompt:string
    private height:number
    private width:number
    private createDate:Date
    private aspectRatio:VideoAspectRatio
    private audio:boolean
    private referenceImages:string[]
    
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
    setReferenceImages(referenceImages?:string[]){
        if(referenceImages){
            this.referenceImages = referenceImages
        }else{
            this.referenceImages=[]
        }
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
    getHeight(): number {
        return this.height
    }
    
    getWidth(): number {
        return this.width
    }
    
    getCreateDate(): Date {
        return this.createDate
    }
    
    getAspectRatio(): VideoAspectRatio {
        return this.aspectRatio
    }
    getReferenceImages(){
        return this.referenceImages
    }

    build(){
        return this
    }
}