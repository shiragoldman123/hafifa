import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { rabbitMQConfig } from 'src/config/rabbitmq.config';

@Injectable()
export class RabbitMQService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: rabbitMQConfig.urls,
        queue: rabbitMQConfig.queue,
        queueOptions: rabbitMQConfig.queueOptions,
      },
    });
  }

  async publish(pattern: string, data: any) {
    return this.client.emit(pattern, data).toPromise();
  }
}