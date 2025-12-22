import { AspectRatioImage } from "src/modules/image/domain/enums/image-aspect-ratio"
import { TypeStyle } from "src/modules/image/domain/enums/image-styles"
import { TypeSubStyle } from "src/modules/image/domain/enums/image-substyle"

export class ImageDataVO {
    constructor(
        public readonly id: string,
        public readonly prompt: string,
        public readonly createDate: Date,
        public readonly width: number,
        public readonly height: number,
        public readonly imageUrl: string,
        public readonly aspectRatio: AspectRatioImage,
        public readonly size: string,
        public readonly style: TypeStyle,
        public readonly subStyle: TypeSubStyle
    ) {}
    
    static create(data: {
        id: string
        prompt: string
        createDate: Date
        width: number
        height: number
        imageUrl: string
        aspectRatio: AspectRatioImage
        size: string
        style: TypeStyle
        subStyle: TypeSubStyle
    }): ImageDataVO {
        return new ImageDataVO(
            data.id,
            data.prompt,
            data.createDate,
            data.width,
            data.height,
            data.imageUrl,
            data.aspectRatio,
            data.size,
            data.style,
            data.subStyle
        )
    }
}