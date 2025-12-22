import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import config from '../config/env.config';

export type UserDocument = User & Document;

@Schema({
  collection: config.mongo.usersCollectionName,
  strict: false,
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ type: String, require: false })
  @ApiProperty({ example: 123456, description: "The user's personal number", required: true })
  personalNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ [config.mongo.queries.personalNumberKeyName]: 1 }, { unique: true });
UserSchema.index({ [config.mongo.queries.identityCardKeyName]: 1 }, { unique: true });
UserSchema.index({ [config.mongo.queries.usernameKeyName]: 1 }, { unique: true });
