import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import envConfig from 'src/config/env.config';
import { RabbitMQService } from './rabbit.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'nest_template_rabbit',
        transport: Transport.RMQ,
        options: {
          urls: [envConfig.rabbit.host],
          queue: envConfig.rabbit.queueNameProducer,
          noAck: false,
          prefetchCount: envConfig.rabbit.prefetchCount,
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
