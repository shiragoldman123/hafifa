import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  findUserByAccount(accountId: string) {
        const objId = new Types.ObjectId(accountId);
    console.log('Searching for account:', objId, typeof objId);
   return this.userModel
      .findOne({ accounts: objId })
      .orFail(new NotFoundException(`User not found for account ${objId}`))
      .lean();
  }

    findUsersWithSource(source: string) {
    return this.userModel
      .find({accounts: {source: source}})
      .lean();
  }

  // finds how many pages the users take
  async findUsersPageNum(limit: number) {
    return Math.ceil((await this.userModel.countDocuments()) / limit);
  }
}
