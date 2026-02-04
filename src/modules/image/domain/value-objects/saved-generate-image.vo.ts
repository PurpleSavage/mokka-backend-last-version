import { AspectRatioImage } from "../../../../shared/infrastructure/enums/image-aspect-ratio"
import { TypeStyle } from "../enums/image-styles"
import { TypeSubStyle } from "../enums/image-substyle"

export class SavedGenerateImageVO {
  private constructor(
    readonly user: string,
    readonly prompt: string,
    readonly width: number,
    readonly height: number,
    readonly aspectRatio: AspectRatioImage,
    readonly imageUrl: string,
    readonly size: string,
    readonly style: TypeStyle,
    readonly subStyle: TypeSubStyle
  ) {}

  static create(props: {
    user: string;
    prompt: string;
    width: number;
    height: number;
    aspectRatio: AspectRatioImage;
    imageUrl: string;
    size: string;
    style: TypeStyle;
    subStyle: TypeSubStyle;
  }): SavedGenerateImageVO {
    return new SavedGenerateImageVO(
      props.user,
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