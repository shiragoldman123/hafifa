import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from 'src/user/user.dto';

@Injectable()
export class accountsRepository {
  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

  createAccount(accountDto: CreateUserDto) {
    const createdAccount = new this.accountModel(accountDto);
    return createdAccount.save();
  }

  async connectUserToAccount(accountId: ObjectId, userId: ObjectId) {
    // const account = await this.accountModel
    // .findById(accountId)
    // .orFail(new NotFoundException(`Account not found with id ${accountId}`));

    // account.user = userId;

    // return account.save();
    const result = await this.accountModel.updateOne({ _id: accountId }, { $set: { user: userId } });

    if (result.matchedCount === 0) {
      throw new NotFoundException(`Account not found with id ${accountId}`);
    }
  }

  async diconnectUserToAccount(accountId: ObjectId) {
    // const account = await this.accountModel
    // .findById(accountId)
    // .orFail(new NotFoundException(`Account not found with id ${accountId}`));

    // account.user = null;

    // return account.save();
    const result = await this.accountModel.updateOne({ _id: accountId }, { $set: { user: null } });

    if (result.matchedCount === 0) {
      throw new NotFoundException(`Account not found with id ${accountId}`);
    }
  }

  async updateAccountsEmail(accountId: ObjectId, email: string) {
    const result = await this.accountModel.updateOne({_id: accountId}, {$set: {email: email}});

    if (result.matchedCount === 0) {
      throw new NotFoundException(`Account not found with id ${accountId}`);
    }
  }

  findAllAcountsFromSource(source: string) {
    return this.accountModel.find({source: source}).lean();
  }
}
