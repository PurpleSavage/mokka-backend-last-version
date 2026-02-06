import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { TypeAuth } from '../../domain/enums/type-auth';

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  refreshtoken: string;

  @Prop({ required: true, enum: TypeAuth })
  typeAuth: TypeAuth;

  @Prop({ required: true})
  credits: number;
}

export const UserSchema = SchemaFactory.createForClass(User)

// Aquí definimos el virtual populate para audios
UserSchema.virtual('audios', {
  ref: 'Audio',             
  localField: '_id',        
  foreignField: 'user',   
  justOne: false,           
});

UserSchema.virtual('texts',{
  ref:'Text',
  localField:'_id',
  foreignField:'user',
  justOne:false
})

UserSchema.virtual('images',{
  ref:'Image',
  localField:'_id',
  foreignField:'user',
  justOne:false
})

UserSchema.virtual('videos',{
  ref:'Video',
  localField:'_id',
  foreignField:'user',
  justOne:false
})
UserSchema.virtual('remixImages',{
  ref:'RemixImage',
  localField:'_id',
  foreignField:'user',
  justOne:false
})

UserSchema.virtual('sharedImages',{
  ref:'ImageShared',
  localField:'_id',
  foreignField:'user',
  justOne:false
})
UserSchema.virtual('influencers',{
  ref:'Influencers',
  localField:'_id',
  foreignField:'user',
  justOne:false
})


// Para que el virtual aparezca en JSON y en objetos normales
UserSchema.set('toObject', { virtuals: true })
UserSchema.set('toJSON', { virtuals: true })

UserSchema.set('timestamps', true)