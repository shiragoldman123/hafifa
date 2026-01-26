import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import envConfig from 'src/config/env.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ',
        transport: Transport.RMQ,
        options: {
          urls: envConfig.rabbit.urls,
          queue: envConfig.rabbit.queue,
          queueOptions: envConfig.rabbit.queueOptions,
        },
      },
    ]),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService], 
})
export class RabbitMQModule {}

