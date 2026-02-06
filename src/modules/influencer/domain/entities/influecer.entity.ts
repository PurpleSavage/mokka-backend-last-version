import { Gender } from '@elevenlabs/elevenlabs-js/api';
import { AgeRange } from '../enums/valid-ramge-age';
import { BodyShape } from '../enums/valid-body-shape';
import { SkinColor } from '../enums/valid-skin-color';
import { EyeColor } from '../enums/valid-eye-color';
import { HairType } from '../enums/valid-hair-type';
import { FaceType } from '../enums/valid-face-type';
import { LipsType } from '../enums/valid-lips-type';

export class InfluencerEntity {
  private id: string;
  private name: string;
  private ageRange: AgeRange;
  private gender: Gender;
  private bodyShape: BodyShape;
  private skinColor: SkinColor;
  private eyeColor: EyeColor;
  private hairType: HairType;
  private faceType: FaceType;
  private country: string;
  private lipsType: LipsType;
  private hairColor: string;
  private height: number;
  private influencerUrlImage:string
  public createDate: Date
  public sizeImage:string
  constructor() {}

  getInfluencerUrlImage(): string {
    return this.influencerUrlImage;
  }
  getSizeImage():string{
    return this.sizeImage
  }
  getCreteDate(): Date {
    return this.createDate;
  }
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getAgeRange(): AgeRange {
    return this.ageRange;
  }
  getGender(): Gender {
    return this.gender;
  }
  getBodyShape(): BodyShape {
    return this.bodyShape;
  }
  getSkinColor(): SkinColor {
    return this.skinColor;
  }
  getEyeColor(): EyeColor {
    return this.eyeColor;
  }
  getHairType(): HairType {
    return this.hairType;
  }
  getFaceType(): FaceType {
    return this.faceType;
  }
  getCountry(): string {
    return this.country;
  }
  getLipsType(): LipsType {
    return this.lipsType;
  }
  getHairColor(): string {
    return this.hairColor;
  }
  getHeight(): number {
    return this.height;
  }

  setId(id: string): this {
    this.id = id;
    return this;
  }
  setSizeImage(size:string):this{
    this.sizeImage = size
    return this
  }
  setCreateDate(date:Date):this{
    this.createDate=date;
    return this;
  }
  setName(name: string): this {
    this.name = name;
    return this;
  }

  setAgeRange(ageRange: AgeRange): this {
    this.ageRange = ageRange;
    return this;
  }

  setGender(gender: Gender): this {
    this.gender = gender;
    return this;
  }

  setBodyShape(bodyShape: BodyShape): this {
    this.bodyShape = bodyShape;
    return this;
  }

  setSkinColor(skinColor: SkinColor): this {
    this.skinColor = skinColor;
    return this;
  }

  setEyeColor(eyeColor: EyeColor): this {
    this.eyeColor = eyeColor;
    return this;
  }

  setHairType(hairType: HairType): this {
    this.hairType = hairType;
    return this;
  }

  setFaceType(faceType: FaceType): this {
    this.faceType = faceType;
    return this;
  }

  setCountry(country: string): this {
    this.country = country;
    return this;
  }

  setLipsType(lipsType: LipsType): this {
    this.lipsType = lipsType;
    return this;
  }

  setHairColor(hairColor: string): this {
    this.hairColor = hairColor;
    return this;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }
  setInfluencerUrlImage(url:string):this{
    this.influencerUrlImage=url;
    return this;
  }
  build(): InfluencerEntity {
    return this;
  }
}
