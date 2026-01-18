import { Module } from '@nestjs/common';
import { ReadUsersService } from './readUser.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { AccountModule } from 'src/account/account.module';
import { HttpModule } from '@nestjs/axios';
import { UserRead, UserSchema } from './userRead.schema';
import { UserReadRepository } from './userRead.repository';
import { UsersConsumer } from './user.consumer';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserRead.name, schema: UserSchema }]),  AccountModule, HttpModule],
  controllers: [UserController, UsersConsumer],
  providers: [ReadUsersService, UserReadRepository],
})
export class UserModule {}
