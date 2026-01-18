export const rabbitMQConfig = {
  urls: ['amqp://rabbitmq:5672'], 
  queue: 'events_queue',
  queueOptions: {
    durable: true,
  },
};