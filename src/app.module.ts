import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import envConfig from './config/env.config';
import RabbitMQModule from './shared/rabbit/rabbit.module';
import { DataAccessModule } from './shared/dataAccess/dataAccess.module';

@Module({
  imports: [ScheduleModule.forRoot(), MongooseModule.forRoot(envConfig.mongo.uri), UserModule, RabbitMQModule, DataAccessModule ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('*');
  }
}
