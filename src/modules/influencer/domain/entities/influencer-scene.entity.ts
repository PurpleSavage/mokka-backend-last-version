import { InfluencerEntity } from "./influecer.entity"

export class InfluencerSceneEntity{
    private id:string
    private urlScene:string
    private prompt:string
    private influencer:InfluencerEntity | string
    private volume:boolean
    private duration:number


    getId(){
        return this.id
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
    getDuration(){
        return this.duration
    }
    setId(id:string): this{
        this.id =id
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
    setDuration(duration:number):this{
        this.duration=duration
        return this
    }
    build(){
        return this
    }
}