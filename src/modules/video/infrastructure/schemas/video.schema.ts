import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { VideoAspectRatio } from "../../../../shared/domain/enums/video-aspectratio";




export type VideoDocument = HydratedDocument<Video>
@Schema()
export class Video{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;


    @Prop({required:true})
    prompt:string;


    @Prop({required:true})
    videoUrl:string;

    @Prop({required:true})
    height:number

    @Prop({required:true})
    width:number

    @Prop({ default: Date.now })
    createdAt: Date;


    @Prop({required:true,enum:VideoAspectRatio})
    aspectRatio:VideoAspectRatio


    @Prop({required:false})
    referenceImages?:string[]


    @Prop({required:true})
    audio:boolean
    
}

export const VideoSchema = SchemaFactory.createForClass(Video);
VideoSchema.set('timestamps', true);