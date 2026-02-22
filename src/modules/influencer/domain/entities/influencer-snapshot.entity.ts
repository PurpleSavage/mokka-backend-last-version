import { AspectRatioImage } from "src/shared/infrastructure/enums/image-aspect-ratio"
import { Environment } from "../enums/valid-eviroments"
import { OutfitType } from "../enums/valid-outfits"
import { InfluencerEntity } from "./influecer.entity"

export class InfluencerSnapshotEntity{
    private influencer:InfluencerEntity | string
    private snapshotUrl:string
    private prompt:string
    private enviroment:Environment
    private outfitStyle:OutfitType
    private createdAt:Date
    private id:string   
    private aspectRatio:AspectRatioImage
    getId(){
        return this.id
    }
   
    getInfluencer(){
        return this.influencer
    }

    getsnapshotUrl(){
        return this.snapshotUrl
    }
    getAspectRatio(){
        return this.aspectRatio
    }
    getPrompt(){
        return this.prompt
    }
    getEnviroment(){
        return this.enviroment
    }
    getOutfitStyle(){
        return this.outfitStyle
    }
    getCreateDate(){
        return this.createdAt
    }
    

    setId(id:string){
        this.id=id
        return this
    }
    setAspectRatio(aspectRatio:AspectRatioImage){
        this.aspectRatio=aspectRatio
        return this
    }
    setInfluencer(influencer:InfluencerEntity | string){
        this.influencer=influencer
        return this
    }
    setsnapshotUrl(snapshotUrl:string){
        this.snapshotUrl=snapshotUrl
        return this
    }
    setPrompt(prompt:string){
        this.prompt=prompt
        return this
    }
    setEnviroment(enviroment:Environment){
        this.enviroment=enviroment
        return this
    }
    setOutfitStyle(outfitStyle:OutfitType){
        this.outfitStyle=outfitStyle
        return this
    }
    setCreateDate(createdAt:Date){
        this.createdAt=createdAt
        return this
    }
    build(){
        return this
    }
    
}