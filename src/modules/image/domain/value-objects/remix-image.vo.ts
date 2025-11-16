import { AspectRatio } from "../enums/image-aspect-ratio"

export class RemixImageVo {
  private constructor(
    readonly user:string,
    readonly prompt: string,
    readonly width: number,
    readonly height: number,
    readonly imageUrl:string,
    readonly aspectRatio:AspectRatio,
    readonly imageShared:string,
    readonly prevImageUrl:string,
    readonly size:number
  ) {}

  static create(props: {
    user:string,
    prompt: string,
    width: number,
    height: number,
    imageUrl:string,
    aspectRatio:AspectRatio,
    imageShared:string,
    prevImageUrl:string,
    imageBase:string,
    size:number
  }) {
    return new RemixImageVo(
        props.user,
        props.prompt,
        props.width,
        props.height,
        props.imageUrl,
        props.aspectRatio,
        props.imageShared,
        props.prevImageUrl,
        props.size
    )
  }
}