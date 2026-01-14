export const rabbitMQConfig = {
  urls: ['amqp://localhost:5672'], 
  queue: 'events_queue',
  queueOptions: {
    durable: true,
  },
};