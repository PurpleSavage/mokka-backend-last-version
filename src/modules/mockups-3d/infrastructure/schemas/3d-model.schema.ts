import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {  ModelNodeDocument, ModelNodeSchema } from './3d-node-schema';
import { StatusModel, StatusModelType } from '../../domain/enums/status-model';

export type ModelDocument = HydratedDocument<Model>;

export class Model {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ 
  type: String, 
    enum: Object.values(StatusModel),
    default: StatusModel.ACTIVE 
    })
    status: StatusModelType;

  @Prop({ required: true })
  model_url: string;

  @Prop({ required: true })
  thumbnail_url: string;

  @Prop({ type: Object, required: true })
  camera_settings: {
    position: number[];
    target: number[];
    fov: number;
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [ModelNodeSchema] })
  nodes: Types.DocumentArray<ModelNodeDocument>;
}
export const ModelSchema = SchemaFactory.createForClass(Model);
ModelSchema.set('timestamps', true);
