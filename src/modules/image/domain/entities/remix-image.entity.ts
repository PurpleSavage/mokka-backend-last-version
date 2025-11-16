import { AspectRatio } from "../enums/image-aspect-ratio"

export class RemixImageEntity{
    public id: string
    public prompt: string
    public createDate: Date
    public width: number
    public height: number
    public imageUrl: string
    public aspectRatio: AspectRatio
    public size: string
    public prevImageUrl:string
    public imageBase:string
    constructor() {}
      
    setId(id: string) {
        this.id = id
        return this
    }
      
    setPrompt(prompt: string) {
        this.prompt = prompt
        return this
    }
      
    setCreateDate(createDate: Date) {
        this.createDate = createDate
        return this
    }
      
    setWidth(width: number) {
        this.width = width
        return this
    }
      
    setHeight(height: number) {
        this.height = height
        return this
    }
      
    setImageUrl(imageUrl: string) {
        this.imageUrl = imageUrl
        return this
    }
      
    setAspectRatio(aspectRatio: AspectRatio) {
        this.aspectRatio = aspectRatio
        return this
    }
      
    setSize(size: string) {
        this.size = size
        return this
    }
    setPrevImageUrl(prevImageUrl:string){
        this.prevImageUrl=prevImageUrl
        return this
    }
    setImageBase(imageBase:string){
        this.imageBase=imageBase
        return this
    }
    build(): RemixImageEntity {
        return this
    }
}