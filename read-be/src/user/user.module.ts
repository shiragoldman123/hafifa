import { Module } from '@nestjs/common';
import { ReadUsersService } from './readUser.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { AccountModule } from 'src/account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { UserRead, UserSchema } from './userRead.schema';
import { UserReadRepository } from './userRead.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserRead.name, schema: UserSchema }]),  AccountModule, ScheduleModule.forRoot(), HttpModule],
  controllers: [UserController],
  providers: [ReadUsersService, UserReadRepository],
})
export class UserModule {}
