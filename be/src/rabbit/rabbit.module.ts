import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import { rabbitMQConfig } from 'src/config/rabbitmq.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ',
        transport: Transport.RMQ,
        options: {
          urls: rabbitMQConfig.urls,
          queue: rabbitMQConfig.queue,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService], 
})
export class RabbitMQModule {}

