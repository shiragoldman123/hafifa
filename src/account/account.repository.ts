import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { createdAccount } from './account.dto';

@Injectable()
export class AccountsRepository {
  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

  createAccount(accountDto: createdAccount) {
    const createdAccount = new this.accountModel(accountDto);
    return createdAccount.save();
  }

  async connectUserToAccount(accountId: Types.ObjectId, userId: Types.ObjectId, session: ClientSession) {
    const result = await this.accountModel.updateOne(
    { _id: accountId },
    { $set: { user: userId } },
    { session },
  );

  if (result.matchedCount === 0) {
    throw new NotFoundException(`Account not found with id ${accountId}`);
  }
  }

  async diconnectUserToAccount(accountId: Types.ObjectId, session: ClientSession) {
     const result = await this.accountModel.updateOne(
    { _id: accountId },
    { $set: { user: null } },
    { session },
  );

  if (result.matchedCount === 0) {
    throw new NotFoundException(`Account not found with id ${accountId}`);
  }
  }

  async updateAccountsEmail(accountId: Types.ObjectId, email: string) {
    const result = await this.accountModel.updateOne({ _id: accountId }, { $set: { email: email } });

    if (result.matchedCount === 0) {
      throw new NotFoundException(`Account not found with id ${accountId}`);
    }
  }

  findAllAcountsFromSource(source: string) {
    return this.accountModel.find({ source: source }).lean();
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
        $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userDetails' },
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
