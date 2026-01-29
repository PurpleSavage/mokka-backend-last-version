import { IsNotEmpty, IsString, IsEnum, IsNumber, Min, Max } from "class-validator";
import { AgeRange } from "../../domain/enums/valid-ramge-age";
import { Gender } from "../../domain/enums/valid-gender";
import { BodyShape } from "../../domain/enums/valid-body-shape";
import { SkinColor } from "../../domain/enums/valid-skin-color";
import { EyeColor } from "../../domain/enums/valid-eye-color";
import { HairType } from "../../domain/enums/valid-hair-type";
import { FaceType } from "../../domain/enums/valid-face-type";
import { LipsType } from "../../domain/enums/valid-lips-type";
import { HairColor } from "../../domain/enums/valid-hair-colors";

export class CreateInfluencerDto {
    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(AgeRange)
    ageRange: AgeRange;

    @IsNotEmpty()
    @IsEnum(Gender) 
    gender: Gender;

    @IsNotEmpty()
    @IsEnum(BodyShape)
    bodyShape: BodyShape;

    @IsNotEmpty()
    @IsEnum(SkinColor)
    skinColor: SkinColor;

    @IsNotEmpty()
    @IsEnum(EyeColor)
    eyeColor: EyeColor;

    @IsNotEmpty()
    @IsEnum(HairType)
    hairType: HairType;

    @IsNotEmpty()
    @IsEnum(FaceType)
    faceType: FaceType; 

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsEnum(LipsType) 
    lipsType: LipsType;

    @IsNotEmpty()
    @IsEnum(HairColor)
    hairColor: HairColor;

    @IsNotEmpty()
    @IsNumber()
    @Min(120) // Altura mínima en cm
    @Max(250) // Altura máxima en cm
    height: number;
}