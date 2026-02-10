import { VideoAspectRatio } from "src/shared/domain/enums/video-aspectratio"
import { InfluencerEntity } from "./influecer.entity"

export class InfluencerSceneEntity{
    private id:string
    private urlScene:string
    private prompt:string
    private influencer:InfluencerEntity | string
    private volume:boolean
    private imageBaseUrls:string[]
    private aspectRatio:VideoAspectRatio
    private createdAt:Date

    getId(){
        return this.id
    }
    getCreateDate(){
        return this.createdAt
    }
    getAspectRatio(){
        return this.aspectRatio
    }
    getImageBAseUrls(){
        return this.imageBaseUrls
    }
    getUrlScene(){
        return this.urlScene
    }
    getPrompt(){
        return this.prompt
    }
    getInfluencer(){
        return this.influencer
    }
    getVolume(){
        return this.volume
    }
    
    setId(id:string): this{
        this.id =id
        return this
    }
    setCreateDate(createdAt:Date){
        this.createdAt=createdAt
        return this
    }
    setUrlScene(url:string):this{
        this.urlScene=url
        return this
    }
    setPrompt(prompt:string){
        this.prompt= prompt
        return this
    }
    setInfluencer(influencer:InfluencerEntity | string):this{
        this.influencer= influencer
        return this
    }
    setVolume(volume:boolean):this{
        this.volume= volume
        return this
    }
    setImageBaseUrls(urls:string[]){
        this.imageBaseUrls= urls
        return this
    }
    setAspectRatio(aspectRatio:VideoAspectRatio){
        this.aspectRatio=aspectRatio
        return this
    }
    build(){
        return this
    }
}