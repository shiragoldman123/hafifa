import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  constructor(@Inject('RABBITMQ') private readonly client: ClientProxy) {}

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('RabbitMQ connected');
    } catch (err: any) {
      console.log(`connection failed: ${err.message}`);
    }
  }

  public publishMessageToQueue(pattern: string, data: any) {
    console.log(`Emitting: ${pattern}`, data);
    this.client.emit(pattern, data).subscribe();  
  }
}
