import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserRepository } from '../user/user.repository';
import { UserController } from './user.controller';
import { AccountModule } from 'src/account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),  AccountModule, ScheduleModule.forRoot(), HttpModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
