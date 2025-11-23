import { Format } from "../enums/format-options"
import { Length } from "../enums/length-options"
import { Tone } from "../enums/tone-options"

export class TextEntity {
    public id: string
    public context: string
    public promotionType: string
    public title: string
    public toneType: Tone
    public textLength: Length
    public textFormat: Format
    public improvedContext: string
    public createDate: Date

    constructor() {}

    setId(id: string) {
        this.id = id
        return this
    }

    setContext(context: string) {
        this.context = context
        return this
    }

    setPromotionType(promotionType: string) {
        this.promotionType = promotionType
        return this
    }

    setTitle(title: string) {
        this.title = title
        return this
    }

    setToneType(toneType: Tone) {
        this.toneType = toneType
        return this
    }

    setTextLength(textLength: Length) {
        this.textLength = textLength
        return this
    }

    setTextFormat(textFormat: Format) {
        this.textFormat = textFormat
        return this
    }

    setImprovedContext(improvedContext: string) {
        this.improvedContext = improvedContext
        return this
    }

    setCreateDate(createDate: Date) {
        this.createDate = createDate
        return this
    }

    build(): TextEntity {
        return this
    }
}
