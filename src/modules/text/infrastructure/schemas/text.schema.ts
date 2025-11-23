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

    @Prop({ required: true })
    context:string

    @Prop({ default: Date.now })
    createdAt: Date


    @Prop({ required: true})
    promotionType:string


    @Prop({ required: true })
    title: string;


    @Prop({ required: true,enum:Tone})
    toneType: Tone;

    @Prop({ required: true,enum:Length})
    textLength: Length;


    @Prop({ required: true,enum:Format})
    textFormat: Format;

    @Prop({ required: true })
    improvedContext:string
}

export const TextSchema = SchemaFactory.createForClass(Text);
TextSchema.set('timestamps', true);

