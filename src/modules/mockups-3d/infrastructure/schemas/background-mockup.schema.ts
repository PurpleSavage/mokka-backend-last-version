import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type BackgroundMockupDocument = HydratedDocument<BackgroundMockup>;
@Schema()
export class BackgroundMockup{
    @Prop({ required: true })
    background_url:string

    @Prop({ required: true })
    name:string

    @Prop({ default: Date.now })
    createdAt: Date;

}

export const BackgroundMockupSchema = SchemaFactory.createForClass(BackgroundMockup);
BackgroundMockupSchema .set('timestamps', true);
