import * as env from 'env-var';
import 'dotenv/config';

const config = {
  service: {
    port: env.get('PORT').default(3000).asIntPositive(),
    updateCron: env.get('UPDATE_CRON').default('0 */3 * * *').asString(),
    runCronOnStart: env.get('RUN_CRON_ON_START').default('true').asBool(),
  },
  mongo: {
    uri: env.get('MONGO_URI').required().asUrlString(),
    usersCollectionName: env.get('USERS_COLLECTION_NAME').required().asString(),
    isReplaceAll: env.get('IS_REPLACE_ALL').default('true').asBool(),
    queries: {
      personalNumberKeyName: env.get('PERSONAL_NUMBER_KEY_NAME').required().asString(),
      identityCardKeyName: env.get('IDENTITY_CARD_KEY_NAME').required().asString(),
      usernameKeyName: env.get('USERNAME_KEY_NAME').required().asString(),
    },
  },
  source: {
    getAllUrl: env.get('SOURCE_GET_ALL_URL').required().asUrlString(),
    timeout: env.get('SOURCE_TIMEOUT').default(10000).asIntPositive(),
  },
  metaData: {
    systemName: env.get('SYSTEM_NAME').required().asString(),
    serviceName: env.get('SERVICE_NAME').required().asString(),
    description: env.get('DESCRIPTION').required().asString(),
  },
  redis: {
    host: env.get('REDIS_HOST').required().asString(),
    port: env.get('REDIS_PORT').required().asIntPositive(),
  },
  rabbit: {
    host: env.get('RABBIT_HOST').required().asString(),
    queueName: env.get('RABBIT_QUEUE_NAME').required().asString(),
    prefetchCount: env.get('RABBIT_PREFETCH_COUNT').default(1).asIntPositive(),
    queueNameConsumer: env.get('RABBIT_QUEUE_NAME_CONSUMER').required().asString(),
    queueNameProducer: env.get('RABBIT_QUEUE_NAME_PRODUCER').required().asString(),
  },
};

export default config;
