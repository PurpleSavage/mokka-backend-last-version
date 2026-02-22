import { AspectRatioImage } from "src/shared/infrastructure/enums/image-aspect-ratio";
import { Environment } from "../enums/valid-eviroments";
import { OutfitType } from "../enums/valid-outfits";

export class SaveSnapshotVo{
    constructor(
        public readonly user:string,
        public readonly influencer:string,
        public readonly snapshotUrl:string,
        public readonly prompt:string,
        public readonly enviroment:Environment,
        public readonly outfitStyle:OutfitType,
        public readonly aspectRatio:AspectRatioImage
    ){
        Object.freeze(this);
    }
    static create(props:{
        user:string,
        influencer:string,
        snapshotUrl:string,
        prompt:string,
        enviroment:Environment,
        outfitStyle:OutfitType,
        aspectRatio:AspectRatioImage
    }):SaveSnapshotVo{
        return new SaveSnapshotVo(
            props.user,
            props.influencer,
            props.snapshotUrl,
            props.prompt,
            props.enviroment,
            props.outfitStyle,
            props.aspectRatio
        )
    }
}