import { AspectRatioImage } from "../enums/image-aspect-ratio"

export class RemixImageVo {
  private constructor(
    readonly user:string,
    readonly prompt: string,
    readonly width: number,
    readonly height: number,
    readonly imageUrl:string,
    readonly aspectRatio:AspectRatioImage,
    readonly prevImageUrl:string,
    readonly size:string,
    readonly imageBase:string
  ) {}

  static create(props: {
    user:string,
    prompt: string,
    width: number,
    height: number,
    imageUrl:string,
    aspectRatio:AspectRatioImage,
    prevImageUrl:string,
    imageBase:string,
    size:string
  }) {
    return new RemixImageVo(
        props.user,
        props.prompt,
        props.width,
        props.height,
        props.imageUrl,
        props.aspectRatio,
        props.prevImageUrl,
        props.size,
        props.imageBase
    )
  }
}