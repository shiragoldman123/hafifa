import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class RabbitMQService {
  constructor(@Inject('nest_template_rabbit') private readonly client: ClientProxy) {}
  public send(pattern: string, data: any) {
    return this.client.send(pattern, data);
  }
}