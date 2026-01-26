import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { WriteAccount } from 'src/account/account.schema';
import config from 'src/config/env.config';
import { Gender } from './user.dto';

export type UserDocument = UserWrite & Document;

@Schema({
  collection: config.mongo.usersCollectionName,
  versionKey: false,
})
export class UserWrite {
  @Prop({ required: true, minlength: 2, maxlength: 50 })
  firstName: string;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  lastName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true,  match: /^\d{9}$/})
  identityCard: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, enum: Gender })
  gender: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: WriteAccount.name, required: false })
  accounts: (ObjectId | WriteAccount)[];
}

export const UserSchema = SchemaFactory.createForClass(UserWrite);
