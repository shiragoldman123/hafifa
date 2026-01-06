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
      .find({ fullName: fullName })
      .orFail(new NotFoundException(`User not found with name ${fullName}`))
      .lean();
  }

  async findUsersPaginated(skip: number, limit: number) {
  const [data, total] = await Promise.all([
    this.userModel
      .find()
      .populate("accounts")
      .skip(skip)
      .limit(limit)
      .lean(),
    this.userModel.countDocuments(),
  ]);

  return { data, total };
}


  findUserByAccount(accountId: Types.ObjectId) {
    return this.userModel
      .findOne({ accounts: accountId })
      .orFail(new NotFoundException(`User not found for account ${accountId}`))
      .lean();
  }

  async connectAccountToUser(accountId: Types.ObjectId, userId: Types.ObjectId) {
    const result = await this.userModel.findByIdAndUpdate(
     userId ,
    { $addToSet: { accounts: accountId } }, 
  );

  if (!result) {
    throw new NotFoundException(`User not found with id ${userId}`);
  }
  }

  async disconnectAccountToUser(accountId: Types.ObjectId, userId: Types.ObjectId) {
     const result = await this.userModel.findByIdAndUpdate(
     userId ,
    { $pull: { accounts: accountId } },
  );

  if (!result) {
    throw new NotFoundException(`User not found with id ${userId}`);
  }
  }

  findUserById(userId: Types.ObjectId) {
      return this.userModel
      .findById( userId )
      .orFail(new NotFoundException(`couldnt find user with id: ${userId}`))
      .lean();
  } 
}
