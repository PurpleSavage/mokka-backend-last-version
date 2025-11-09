import { AspectRatio } from "../enums/image-aspect-ratio"
import { TypeStyle } from "../enums/image-styles"
import { TypeSubStyle } from "../enums/image-substyle"

export class ImageEntity {
  public id: string
  public prompt: string
  public createDate: Date
  public width: number
  public height: number
  public imageUrl: string
  public aspectRatio: AspectRatio
  public size: string
  public style: TypeStyle
  public subStyle: TypeSubStyle
  
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
  
  setStyle(style: TypeStyle) {
    this.style = style
    return this
  }
  
  setSubStyle(subStyle: TypeSubStyle) {
    this.subStyle = subStyle
    return this
  }
  
  build(): ImageEntity {
    return this
  }
}