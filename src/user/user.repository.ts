import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import envConfig from '../config/env.config';
import { User } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  create(userDto: User) {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find();
  }

  find(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, userDto: User) {
    return this.userModel.findByIdAndUpdate(id, userDto);
  }

  deleteById(id: string) {
    return this.userModel.findByIdAndRemove(id);
  }

  findByPersonalNumber(personalNumber: string) {
    const query = {
      [envConfig.mongo.queries.personalNumberKeyName]: personalNumber,
    };
    return this.userModel
      .findOne(query)
      .orFail(new NotFoundException(`User not found with personal number ${personalNumber}`))
      .lean();
  }

  findByIdentityCard(identityCard: string) {
    return this.userModel
      .findOne({
        [envConfig.mongo.queries.identityCardKeyName]: identityCard,
      })
      .orFail(new NotFoundException(`User not found with identity card ${identityCard}`))
      .lean();
  }

  findByUser(user: string) {
    return this.userModel
      .findOne({
        [envConfig.mongo.queries.usernameKeyName]: user,
      })
      .orFail(new NotFoundException(`User not found with user ${user}`))
      .lean();
  }

  insetMany(users: User[]) {
    return this.userModel.insertMany(users);
  }

  deleteAll() {
    return this.userModel.deleteMany();
  }

  // Can be used for bulk update with upsert
  bulkWrite(bulkOps: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.userModel.bulkWrite(bulkOps);
  }
}
