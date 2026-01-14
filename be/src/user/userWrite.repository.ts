import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, ExternalUser } from './user.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserWrite } from './userWrite.schema';

@Injectable()
export class UserWriteRepository {
  private readonly logger = new Logger(UserWriteRepository.name);

  constructor(  private readonly httpService: HttpService, 
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
