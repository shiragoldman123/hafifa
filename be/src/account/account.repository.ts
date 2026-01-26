import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { WriteAccount } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAccountDto } from './account.dto';

@Injectable()
export class AccountsRepository {
  constructor(@InjectModel(WriteAccount.name) private readonly accountModel: Model<WriteAccount>) {}

  async createAccount(accountDto: CreateAccountDto) {
    try {
      const createdAccount = new this.accountModel(accountDto);
      return await createdAccount.save();
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];

        if (field === 'identifier') {
          throw new ConflictException('An account with this identifier already exists');
        }

        throw new ConflictException('An account with these details already exists');
      }
      throw error;
    }
  }

  async connectUserToAccount(accountId: Types.ObjectId, userId: Types.ObjectId) {
    const updatedAccount = await this.accountModel.findByIdAndUpdate(accountId, { $set: { user: userId } });

    if (!updatedAccount) {
      throw new NotFoundException(`Account not found with id ${accountId}`);
    }
  }

  async disconnectUserToAccount(accountId: Types.ObjectId) {
    const updatedAccount = await this.accountModel.findByIdAndUpdate(accountId, { $set: { user: null } });

    if (!updatedAccount) {
      throw new NotFoundException(`Account not found with id ${accountId}`);
    }
  }

  async updateAccountsEmail(accountId: Types.ObjectId, email: string) {
    const result = await this.accountModel.findByIdAndUpdate(accountId, { $set: { email: email } });

    if (!result) {
      throw new NotFoundException(`Account not found with id ${accountId}`);
    }
  }

    findAccountById(accountId: Types.ObjectId) {
    return this.accountModel
      .findById(accountId)
      .orFail(new NotFoundException(`couldnt find account with id: ${accountId}`))
      .lean();
  }
}
