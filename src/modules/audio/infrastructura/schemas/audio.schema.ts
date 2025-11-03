import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  HydratedDocument} from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { IdModelsAudio, ModelsAudio } from '../../domain/enums/audio-models';



export type AudioDocument = HydratedDocument<Audio>


@Schema()
export class Audio {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({required:true})
  prompt: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  

  @Prop({ required: true })
  urlAudio: string;

  @Prop({required:true,enum:IdModelsAudio})
  idModel:IdModelsAudio

  @Prop({required:true,enum:ModelsAudio})
  nameModelAudio:ModelsAudio

  
  @Prop({ required: true })
  speed:number
  
  @Prop({ required: true })
  stability:number
  
  @Prop({ required: true })
  similarity:number
  
  @Prop({ required: true })
  exaggeration:number 
  
  
  @Prop({ required: true })
  useSpeakerBoost:boolean

}

export const AudioSchema = SchemaFactory.createForClass(Audio);
AudioSchema.set('timestamps', true);