import {  Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRead } from './userRead.schema';
import {  ExternalUser } from './user.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserReadRepository {
  constructor(private readonly httpService: HttpService, @InjectModel(UserRead.name) private readonly userModel: Model<UserRead>) {}
  private readonly logger = new Logger(UserReadRepository.name);
  
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

    async createUser(userDto: ExternalUser) {
       const { _id, ...updatableFields } = userDto;
      
       const user = await this.userModel.findByIdAndUpdate(
        _id ,
        { $set: updatableFields,
         },
        { upsert: true, new: true },
      );

      return user.populate('accounts');
  }

  async connectAccountToUser(accountId: Types.ObjectId, userId: Types.ObjectId) {
    const result = await this.userModel.findByIdAndUpdate(userId, { $addToSet: { accounts: accountId } }, {new : true});

    if (!result) {
      throw new NotFoundException(`User not found with id ${userId}`);
    }

    return result;
  }

  async disconnectAccountToUser(accountId: Types.ObjectId, userId: Types.ObjectId) {
    const result = await this.userModel.findByIdAndUpdate(userId, { $pull: { accounts: accountId } }, {new : true});

    if (!result) {
      throw new NotFoundException(`User not found with id ${userId}`);
    }
    return result;
  }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async syncUsers() {
    this.logger.log('Starting user sync...');
    try {
      const response = await firstValueFrom(this.httpService.get<ExternalUser[]>('http://localhost:3000/users'));
      const users = response.data;

      for(const user of users) {
         const { _id, identityCard, ...updatableFields } = user;

          await this.userModel.updateOne(
        { identityCard: user.identityCard },
        { $set: updatableFields,
           $setOnInsert: { identityCard },
         },
        { upsert: true },
      );
      }
      this.logger.log('User sync completed successfully');
    } catch (error: any) {
       this.logger.error('Error syncing users:', error.message);
    }
  }
}
