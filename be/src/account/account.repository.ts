import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import {  Model, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { CreateAccountDto } from './account.dto';

@Injectable()
export class AccountsRepository {
  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

  createAccount(accountDto: CreateAccountDto) {
    const createdAccount = new this.accountModel(accountDto);
    return createdAccount.save();
  }

  async connectUserToAccount(accountId: Types.ObjectId, userId: Types.ObjectId) {
    const updatedAccount = await this.accountModel.findByIdAndUpdate(
     accountId ,
    { $set: { user: userId } },
  );

  if (!updatedAccount) {
    throw new NotFoundException(`Account not found with id ${accountId}`);
  }
  }

  async disconnectUserToAccount(accountId: Types.ObjectId) {
     const updatedAccount = await this.accountModel.findByIdAndUpdate(
    accountId ,
    { $set: { user: null } },
  );

  if (!updatedAccount) {
    throw new NotFoundException(`Account not found with id ${accountId}`);
  }
  }

  async updateAccountsEmail(accountId: Types.ObjectId, email: string) {
    const result = await this.accountModel.findByIdAndUpdate( accountId , { $set: { email: email } });

    if (!result) {
      throw new NotFoundException(`Account not found with id ${accountId}`);
    }
  }

  findAllAcountsFromSource(source: string) {
    return this.accountModel.find({ source: source }).lean();
  }

    findAccountById(accountId: Types.ObjectId) {
      return this.accountModel
      .findById( accountId )
      .orFail(new NotFoundException(`couldnt find account with id: ${accountId}`))
      .lean();
  } 

  findUsersBySource(source: string): Promise<User[]> {
    return this.accountModel.aggregate([
      {
        $match: { source: source },
      },
      {
        $group: { _id: '$user' },
      },
      {
        $lookup: { from: 'Users', localField: '_id', foreignField: '_id', as: 'userDetails' },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $replaceRoot: { newRoot: '$userDetails' },
      },
    ]);
  }
}
