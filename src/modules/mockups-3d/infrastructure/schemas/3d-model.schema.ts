import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {  ModelNodeDocument, ModelNodeSchema } from './3d-node-schema';
import { StatusModel, StatusModelType } from '../../domain/enums/status-model';

export type Model3DDocument = HydratedDocument<Model3D>;

@Schema({ 
  collection: 'models', // <--- ESTO es lo que le dice a Mongo dónde buscar exactamente
  timestamps: true 
})
export class Model3D {
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
  modelUrl: string;

  @Prop({ required: true })
  thumbnailUrl: string;

  @Prop({ type: Object, required: true })
  cameraSettings: {
    position: number[];
    target: number[];
    fov: number;
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [ModelNodeSchema] })
  nodes: Types.DocumentArray<ModelNodeDocument>;
}
export const Model3DSchema = SchemaFactory.createForClass(Model3D);
Model3DSchema.set('timestamps', true);
