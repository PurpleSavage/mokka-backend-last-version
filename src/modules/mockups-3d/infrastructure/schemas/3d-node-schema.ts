import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModelNodeDocument = HydratedDocument<ModelNode>;

@Schema()
export class ModelNode {
  @Prop({ required: true })
  name_mesh: string;

  @Prop({ required: true })
  label: string;

  @Prop({ default: false })
  isEditable: boolean;

  @Prop({ required: true }) 
  materialDefault: string;

  @Prop({
    type: Object,
    default: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
  })
  transform: {
    position: number[];
    rotation: number[];
    scale: number[];
  };

  @Prop({ type: Object })
  decalConfig?: {
    standardPosition: number[];
    maxScale: number[];
    aspectRatio: string;
  };
}
export const ModelNodeSchema = SchemaFactory.createForClass(ModelNode);
