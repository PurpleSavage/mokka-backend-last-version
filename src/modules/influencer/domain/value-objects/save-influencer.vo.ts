import { Gender } from "@elevenlabs/elevenlabs-js/api";
import { AgeRange } from "../enums/valid-ramge-age";
import { BodyShape } from "../enums/valid-body-shape";
import { SkinColor } from "../enums/valid-skin-color";
import { EyeColor } from "../enums/valid-eye-color";
import { HairType } from "../enums/valid-hair-type";
import { FaceType } from "../enums/valid-face-type";
import { LipsType } from "../enums/valid-lips-type";
import { HairColor } from "../enums/valid-hair-colors";

export class SaveInfluencerVo {
  constructor(
    public readonly user: string,
    public readonly name: string,
    public readonly ageRange: AgeRange,
    public readonly gender: Gender,
    public readonly bodyShape: BodyShape,
    public readonly skinColor: SkinColor,
    public readonly eyeColor: EyeColor,
    public readonly hairType: HairType,
    public readonly faceType: FaceType,
    public readonly country: string,
    public readonly lipsType: LipsType,
    public readonly hairColor: HairColor,
    public readonly height: number,
    public readonly influencerUrlImage:string ,
    public readonly size:string
  ) {

    Object.freeze(this); //  asegura inmutabilidad total en tiempo de ejecución
  }

  /**
   * Método estático para crear el Value Object desde el DTO
   * Esto ayuda a desacoplar la capa de entrada de la de dominio
   */
  static create(props:{
    user: string;
    name: string;
    ageRange: AgeRange;
    gender: Gender;
    bodyShape: BodyShape;
    skinColor: SkinColor; 
    eyeColor: EyeColor;
    hairType: HairType;
    faceType: FaceType;
    country: string;
    lipsType: LipsType;
    hairColor: HairColor;
    height: number;
    influencerUrlImage: string;
    size:string
  }): SaveInfluencerVo {
    return new SaveInfluencerVo(
      props.user,
      props.name,
      props.ageRange,
      props.gender,
      props.bodyShape,
      props.skinColor,
      props.eyeColor,
      props.hairType,
      props.faceType,
      props.country,
      props.lipsType,
      props.hairColor,
      props.height,
      props.influencerUrlImage,
      props.size
    );
  }
}