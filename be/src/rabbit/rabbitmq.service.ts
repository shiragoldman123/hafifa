import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';


@Injectable()
export class RabbitMQService implements OnModuleInit {
  constructor(@Inject('RABBITMQ') private readonly client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
    console.log('RabbitMQ connected');
  }

  public emit(pattern: string, data: any): Observable<any> {
    console.log(`Emitting: ${pattern}`, data);
    return this.client.emit(pattern, data);
  }
}