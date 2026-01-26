import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, } from './user.dto';
import { UserWrite } from './userWrite.schema';

@Injectable()
export class UserWriteRepository {
  constructor(  
    @InjectModel(UserWrite.name) private readonly userModel: Model<UserWrite>) {}

  async createUser(userDto: CreateUserDto) {
    try {
      const createdUser = new this.userModel(userDto);

      return await createdUser.save();
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];

        if (field === 'identityCard') {
          throw new ConflictException('A user with this identity card number already exists');
        }

        throw new ConflictException('A user with these details already exists');
      }

      throw error;
    }
  }



  async connectAccountToUser(accountId: Types.ObjectId, userId: Types.ObjectId) {
    const result = await this.userModel.findByIdAndUpdate(userId, { $addToSet: { accounts: accountId } });

    if (!result) {
      throw new NotFoundException(`User not found with id ${userId}`);
    }
  }

  async disconnectAccountToUser(accountId: Types.ObjectId, userId: Types.ObjectId) {
    const result = await this.userModel.findByIdAndUpdate(userId, { $pull: { accounts: accountId } });

    if (!result) {
      throw new NotFoundException(`User not found with id ${userId}`);
    }
  }

    findUserById(userId: Types.ObjectId) {
    return this.userModel
      .findById(userId)
      .orFail(new NotFoundException(`couldnt find user with id: ${userId}`))
      .lean();
  }
}
