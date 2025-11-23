import { Format } from "../enums/format-options"
import { Length } from "../enums/length-options"
import { Tone } from "../enums/tone-options"

export class GenerateTextVO{
    public readonly user: string
    public readonly prompt: string
    public readonly promotionType: string
    public readonly title: string
    public readonly toneType: Tone
    public readonly textLength: Length
    public readonly textFormat: Format
    public readonly improvedContext:string
    private constructor(data:{
        user: string
        prompt: string
        promotionType: string
        title: string
        toneType: Tone
        textLength: Length
        textFormat: Format
        improvedContext:string
    }){
        this.user = data.user
        this.prompt=data.prompt
        this.promotionType=data.promotionType
        this.title=data.title
        this.toneType=data.toneType
        this.textLength=data.textLength
        this.textFormat=data.textFormat
        this.improvedContext=data.improvedContext
    }
    public static create(data:{
        user: string
        prompt: string
        promotionType: string
        title: string
        toneType: Tone
        textLength: Length
        textFormat: Format
        improvedContext:string
    }){
        return new GenerateTextVO(data)
    }

}