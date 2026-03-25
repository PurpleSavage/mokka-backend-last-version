import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Tone } from "../../domain/enums/tone-options";
import { Length } from "../../domain/enums/length-options";
import { Format } from "../../domain/enums/format-options";



export type TextDocument = HydratedDocument<Text>;

@Schema()
export class Text{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Text', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ required: true,type: String })
    context:string

    @Prop({ default: Date.now })
    createdAt: Date


    @Prop({ required: true,type: String})
    promotionType:string


    @Prop({ required: true,type: String })
    title: string;


    @Prop({ required: true,enum:Tone,type: String})
    toneType: Tone;

    @Prop({ required: true,enum:Length,type: String})
    textLength: Length;


    @Prop({ required: true,enum:Format,type: String})
    textFormat: Format;

    @Prop({ required: true,type: String })
    improvedContext:string
}

export const TextSchema = SchemaFactory.createForClass(Text);
TextSchema.set('timestamps', true);

