import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import envConfig from './config/env.config';
import { DataAccessModule } from './shared/dataAccess/dataAccess.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [ScheduleModule.forRoot(), MongooseModule.forRoot(envConfig.mongo.uri), UserModule, DataAccessModule, AccountModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
