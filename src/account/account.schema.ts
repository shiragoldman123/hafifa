import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import config from '../config/env.config';
import { User } from 'src/user/user.schema';

export type AccountDocument = Account & Document;

@Schema({
  collection: config.mongo.accountsCollectionName,
  versionKey: false,
})
export class Account {
    @Prop({required: true})
    identifier: string

    @Prop({required: true})
    source: string

    @Prop()
    email: string

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Users' })
    user: User
}

export const AccountSchema = SchemaFactory.createForClass(Account);