import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
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

  findUserByAccount(accountId: Types.ObjectId) {
    return this.userModel
      .findOne({ accounts: accountId })
      .orFail(new NotFoundException(`User not found for account ${accountId}`))
      .lean();
  }

  // finds how many pages the users take
  async findUsersPageNum(limit: number) {
    return Math.ceil((await this.userModel.countDocuments()) / limit);
  }

  async connectAccountToUser(accountId: Types.ObjectId, userId: Types.ObjectId, session: ClientSession) {
    const result = await this.userModel.updateOne(
    { _id: userId },
    { $addToSet: { accounts: accountId } }, 
    { session },
  );

  if (result.matchedCount === 0) {
    throw new NotFoundException(`User not found with id ${userId}`);
  }
  }

  async disconnectAccountToUser(accountId: Types.ObjectId, userId: Types.ObjectId, session: ClientSession) {
     const result = await this.userModel.updateOne(
    { _id: userId },
    { $pull: { accounts: accountId } },
    { session },
  );

  if (result.matchedCount === 0) {
    throw new NotFoundException(`User not found with id ${userId}`);
  }
  }
}
