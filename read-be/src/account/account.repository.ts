import { Injectable, NotFoundException } from '@nestjs/common';
import { ReadAccount } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRead } from 'src/user/userRead.schema';

@Injectable()
export class AccountsRepository {
  constructor(@InjectModel(ReadAccount.name) private readonly accountModel: Model<ReadAccount>) {}

  findAllAccounts() {
    return this.accountModel.find().lean();
  }

  createAccount(account: any) {
     const { _id, ...updatableFields } = account;
      
       return this.accountModel.findByIdAndUpdate(
        _id ,

        
        { $set: updatableFields,
         },
        { upsert: true, new: true },
      );
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

  findAllAcountsFromSource(source: string) {
    return this.accountModel.find({ source: source }).lean();
  }

  findAccountById(accountId: Types.ObjectId) {
    return this.accountModel
      .findById(accountId)
      .orFail(new NotFoundException(`couldnt find account with id: ${accountId}`))
      .lean();
  }

  findAccountByIdentifier(identifier: string) {
    return this.accountModel.findOne({ identifier }).exec();
  }

async findUsersBySource(source: string): Promise<UserRead[]> {
  const users = await this.accountModel.aggregate([
    { 
      $match: { source } 
    },

    { 
      $group: { _id: "$user" } 
    },
    {
      $lookup: {
        from: "Users",           
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { 
      $unwind: "$user" 
    },
    {
      $lookup: {
        from: "Accounts",        
        localField: "_id",
        foreignField: "user",
        as: "accounts",
      },
    },

    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$user", { accounts: "$accounts" }],
        },
      },
    },
  ]);

  if(users.length === 0) {
    throw new NotFoundException(`no users where found with source ${source}`)
  } 

  return users;
}

  async updateAccountsEmail(accountId: Types.ObjectId, email: string) {
    const result = await this.accountModel.findByIdAndUpdate(accountId, { $set: { email: email } });

    if (!result) {
      throw new NotFoundException(`Account not found with id ${accountId}`);
    }
  }

}
