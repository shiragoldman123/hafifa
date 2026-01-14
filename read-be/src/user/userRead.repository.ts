import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRead } from '../userRead.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserReadRepository {
  constructor(@InjectModel(UserRead.name) private readonly userModel: Model<UserRead>) {}

  findUserByIdentityCard(identityCard: string) {
    return this.userModel
      .findOne({ identityCard: identityCard })
      .orFail(new NotFoundException(`User not found with identity card ${identityCard}`))
      .lean();
  }

  findUserByFullName(fullName: string) {
    return this.userModel
      .find({ fullName: fullName })
      .populate('accounts')
      .orFail(new NotFoundException(`User not found with name ${fullName}`))
      .lean();
  }

  async findUsersPaginated(skip: number, limit: number) {
    const [data, total] = await Promise.all([
      this.userModel.find().populate('accounts').skip(skip).limit(limit).lean(),
      this.userModel.countDocuments(),
    ]);

    return { data, total };
  }

  findUserByAccount(accountId: Types.ObjectId) {
    return this.userModel
      .findOne({ accounts: accountId })
      .orFail(new NotFoundException(`User not found for account ${accountId}`))
      .populate('accounts')
      .lean();
  }

  findUserById(userId: Types.ObjectId) {
    return this.userModel
      .findById(userId)
      .orFail(new NotFoundException(`couldnt find user with id: ${userId}`))
      .lean();
  }
}
