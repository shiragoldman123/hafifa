import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RmqContext } from '@nestjs/microservices';
import { LoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class RabbitMqInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {
    this.logger.setContext(RabbitMqInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rmqContext = context.switchToRpc().getContext<RmqContext>();
    const message = rmqContext.getMessage();
    const channel = rmqContext.getChannelRef();

    return next.handle().pipe(
      tap(() => {
        this.logger.info(
          true,

          `Message has been acknowledged`,
          message.content.toString(),
        );
        channel.ack(message);
      }),
      catchError(async (error) => {
        this.logger.error(
          true,

          `Error with rabbit message`,
          error.message,
        );
      }),
    );
  }
}
