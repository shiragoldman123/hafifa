import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { AccountModule } from 'src/account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { UserRead, UserSchema } from './userRead.schema';
import { UserReadRepository } from './userRead.repository';
import { UserEventHandlers } from './events/user-event.handlers';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserRead.name, schema: UserSchema }]),  AccountModule, ScheduleModule.forRoot(), HttpModule],
  controllers: [UserController],
  providers: [UserService, UserReadRepository, UserEventHandlers],
})
export class UserModule {}
