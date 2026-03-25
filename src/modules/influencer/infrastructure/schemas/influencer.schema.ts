import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument} from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { AgeRange } from '../../domain/enums/valid-ramge-age';
import { Gender } from '../../domain/enums/valid-gender';
import { BodyShape } from '../../domain/enums/valid-body-shape';
import { SkinColor } from '../../domain/enums/valid-skin-color';
import { EyeColor } from '../../domain/enums/valid-eye-color';
import { HairType } from '../../domain/enums/valid-hair-type';
import { FaceType } from '../../domain/enums/valid-face-type';
import { LipsType } from '../../domain/enums/valid-lips-type';
import { HairColor } from '../../domain/enums/valid-hair-colors';




export type InfluencerDocument = HydratedDocument<Influencer>


@Schema()
export class Influencer{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({required:true})
    name: string;
    
    @Prop({required:true,enum:AgeRange,type: String})
    ageRange: AgeRange;

    @Prop({required:true,enum:Gender,type: String})
    gender: Gender;

    @Prop({required:true,enum:BodyShape,type: String})
    bodyShape: BodyShape;

    @Prop({required:true,enum:SkinColor,type: String})
    skinColor: SkinColor;

    @Prop({required:true,enum:EyeColor,type: String})
    eyeColor: EyeColor;

    @Prop({required:true,enum:HairType,type: String})
    hairType: HairType;

    @Prop({ required: true,enum:FaceType,type: String })
    faceType: FaceType; 


    @Prop({ required: true,type: String})
    country: string;


    @Prop({ required: true,enum:LipsType,type: String })
    lipsType: LipsType;

    @Prop({ required: true,enum:HairColor,type: String })
    hairColor: HairColor;

    @Prop({ required: true })   
    height: number;

    @Prop({ required: true,type: String})
    influencerUrlImage:string   

    
    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ required: true,type: String})
    sizeImage:string

}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);
InfluencerSchema.set('timestamps', true);