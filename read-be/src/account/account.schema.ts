import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import config from '../config/env.config';
import { UserWrite } from 'src/user/schemas/userWrite.schema';

export type AccountDocument = Account & Document;

@Schema({
  collection: config.mongo.accountsCollectionName,
  versionKey: false,
})
export class Account {
    @Prop({required: true, unique: true})
    identifier: string

    @Prop({required: true})
    source: string

    @Prop()
    email: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
    user: UserWrite | ObjectId
}

export const AccountSchema = SchemaFactory.createForClass(Account);