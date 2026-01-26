import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserWriteRepository } from './userWrite.repository';
import { UserController } from './user.controller';
import { AccountModule } from 'src/account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { UserWrite, UserSchema } from './userWrite.schema';
import { RabbitMQModule } from 'src/rabbit/rabbit.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserWrite.name, schema: UserSchema }]),  AccountModule, ScheduleModule.forRoot(), HttpModule, RabbitMQModule],
  controllers: [UserController],
  providers: [UserService, UserWriteRepository],
})
export class UserModule {}
