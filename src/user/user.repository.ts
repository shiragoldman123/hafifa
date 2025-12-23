import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  createUser(userDto: CreateUserDto) {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  findUserByIdentityCard(identityCard: string) {
    return this.userModel
      .findOne({ identityCard: identityCard })
      .orFail(new NotFoundException(`User not found with identity card ${identityCard}`))
      .lean();
  }

  findUserByFullName(fullName: string) {
    return this.userModel
      .findOne({ fullName: fullName })
      .orFail(new NotFoundException(`User not found with identity card ${fullName}`))
      .lean();
  }

  findAllUsersInRange(skip: number, limit: number) {
    return this.userModel.find().populate('accounts').skip(skip).limit(limit).lean();
  }

  findUserByAccount(accountId: ObjectId) {
   return this.userModel
      .findOne({ accounts: accountId })
      .orFail(new NotFoundException(`User not found for account ${accountId}`))
      .lean();
  }

    findUsersWithSource(source: string) {
    this.userModel
      .find({accounts: {source: source}})
      .lean();
  }

  // finds how many pages the users take
  findUsersPageNum() {
    return this.userModel.countDocuments();
  }
}
