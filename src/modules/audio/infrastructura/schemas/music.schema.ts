import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';


export type MusicDocument = HydratedDocument<Music>;

@Schema()
export class Music {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  prompt: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true, type: String })
  songUrl: string;

  @Prop({ required: true, type: Number })
  bpm: number;

  @Prop({ required: true, type: String })
  genre: string;

  @Prop({required:true, type: Number})
  durationMs:number
}

export const MusicSchema = SchemaFactory.createForClass(Music);
MusicSchema.set('timestamps', true);
