import { AspectRatio } from "../enums/image-aspect-ratio"
import { TypeStyle } from "../enums/image-styles"
import { TypeSubStyle } from "../enums/image-substyle"

export class SavedGenerateImageVO {
     private constructor(
    readonly userId: string,
    readonly prompt: string,
    readonly width: number,
    readonly height: number,
    readonly aspectRatio: AspectRatio,
    readonly imageUrl: string,
    readonly size: string,
    readonly style: TypeStyle,
    readonly subStyle: TypeSubStyle
  ) {}

  static create(props: {
    userId: string;
    prompt: string;
    width: number;
    height: number;
    aspectRatio: AspectRatio;
    imageUrl: string;
    size: string;
    style: TypeStyle;
    subStyle: TypeSubStyle;
  }): SavedGenerateImageVO {
    return new SavedGenerateImageVO(
      props.userId,
      props.prompt,
      props.width,
      props.height,
      props.aspectRatio,
      props.imageUrl,
      props.size,
      props.style,
      props.subStyle
    );
  }
}