import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import config from '../config/env.config';
import { UserRead } from 'src/user/userRead.schema';

export type AccountDocument = ReadAccount & Document;

@Schema({
  collection: config.mongo.accountsReadCollectionName,
  versionKey: false,
})
export class ReadAccount {
    @Prop({required: true, unique: true})
    identifier: string

    @Prop({required: true})
    source: string

    @Prop()
    email: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'users_view' })
    user: UserRead | ObjectId
}

export const AccountSchema = SchemaFactory.createForClass(ReadAccount);