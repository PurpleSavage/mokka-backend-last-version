import {  HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type BaseSharedDocument = HydratedDocument<SharedBase>
@Schema()
export class SharedBase{
   

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    sharedBy: MongooseSchema.Types.ObjectId; 

    @Prop({ default: 0 })
    remixes: number;

    @Prop({default:0})
    downloads:number
}

export const SharedBaseDocument = SchemaFactory.createForClass(SharedBase)

SharedBaseDocument.set('timestamps', true)