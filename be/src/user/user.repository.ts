import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto, ExternalUser } from './user.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(  private readonly httpService: HttpService, 
    @InjectModel(User.name) private readonly userModel: Model<User>) {}

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

  @Cron(CronExpression.EVERY_10_SECONDS)
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
