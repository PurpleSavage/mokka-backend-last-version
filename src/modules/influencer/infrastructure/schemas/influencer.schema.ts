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
    
    @Prop({required:true,enum:AgeRange})
    ageRange: AgeRange;

    @Prop({required:true,enum:Gender})
    gender: Gender;

    @Prop({required:true,enum:BodyShape})
    bodyShape: BodyShape;

    @Prop({required:true,enum:SkinColor})
    skinColor: SkinColor;

    @Prop({required:true,enum:EyeColor})
    eyeColor: EyeColor;

    @Prop({required:true,enum:HairType})
    hairType: HairType;

    @Prop({ required: true,enum:FaceType })
    faceType: FaceType; 


    @Prop({ required: true})
    country: string;


    @Prop({ required: true,enum:LipsType })
    lipsType: LipsType;

    @Prop({ required: true,enum:HairColor })
    hairColor: HairColor;

    @Prop({ required: true })   
    height: number;

    @Prop({ required: true})
    influencerUrlImage:string   

    
    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ required: true})
    sizeImage:string

}

export const InfluencerSchema = SchemaFactory.createForClass(Influencer);
InfluencerSchema.set('timestamps', true);