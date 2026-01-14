import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import envConfig from './config/env.config';
import { AccountModule } from './account/account.module';
import RabbitMQModule from './rabbit/rabbit.module';

@Module({
  imports: [ScheduleModule.forRoot(), MongooseModule.forRoot(envConfig.mongo.uri), UserModule, AccountModule, RabbitMQModule],
})
export class AppModule  {}

