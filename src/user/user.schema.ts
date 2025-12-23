import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, Document, ObjectId } from 'mongoose';
import config from '../config/env.config';
import { Account } from 'src/account/account.schema';

export type UserDocument = User & Document;

@Schema({
  collection: config.mongo.usersCollectionName,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  identityCard: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true })
  gender: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Account', required: false })
  accounts: Account[];
}

export const UserSchema = SchemaFactory.createForClass(User);
