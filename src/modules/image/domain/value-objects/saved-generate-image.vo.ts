import { AspectRatio } from "../enums/image-aspect-ratio"
import { TypeStyle } from "../enums/image-styles"
import { TypeSubStyle } from "../enums/image-substyle"

export class SavedGenerateImageVO {
    public userId: string
    public prompt: string
    public width: number
    public height: number
    public aspectRatio: AspectRatio
    public imageUrl: string
    public size: string
    public style: TypeStyle
    public subStyle: TypeSubStyle
    
    constructor() {}
    
    setUserId(userId: string) {
        this.userId = userId
        return this
    }
    
    setPrompt(prompt: string) {
        this.prompt = prompt
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
    
    setAspectRatio(aspectRatio: AspectRatio) {
        this.aspectRatio = aspectRatio
        return this
    }
    
    setImageUrl(imageUrl: string) {
        this.imageUrl = imageUrl
        return this
    }
    
    setSize(size: string) {
        this.size = size
        return this
    }
    
    setStyle(style: TypeStyle) {
        this.style = style
        return this
    }
    
    setSubStyle(subStyle: TypeSubStyle) {
        this.subStyle = subStyle
        return this
    }
    
    build(): SavedGenerateImageVO {
        return this
    }
}