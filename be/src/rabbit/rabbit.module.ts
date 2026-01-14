import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq.service';
import { rabbitMQConfig } from 'src/config/rabbitmq.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'nest_template_rabbit',
        transport: Transport.RMQ,
        options: {
          urls: rabbitMQConfig.urls,
          queue: rabbitMQConfig.queue,
          noAck: false,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [RabbitMQService],
  providers: [RabbitMQService],
})
export default class RabbitMQModule {}
