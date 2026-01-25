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
    usersReadCollectionName: env.get('USERS_VIEW_COLLECTION_NAME').required().asString(),
    accountsReadCollectionName: env.get('ACCOUNTS_VIEW_COLLECTION_NAME').required().asString(),
    isReplaceAll: env.get('IS_REPLACE_ALL').default('true').asBool(),
  },
  source: {
    timeout: env.get('SOURCE_TIMEOUT').default(10000).asIntPositive(),
  },
  metaData: {
    systemName: env.get('SYSTEM_NAME').required().asString(),
    serviceName: env.get('SERVICE_NAME').required().asString(),
    description: env.get('DESCRIPTION').required().asString(),
  },
  rabbit: {
    urls: [env.get('RABBIT_URLS').required().asUrlString()],
    queue: env.get('RABBIT_QUEUE').required().asString(),
    // TODO- write it in env file
    queueOptions: {
      durable: true,
    },
  },
  elasticSearch : {
    node: env.get('ELASTICSEARCH_NODE').required().asString()
  }
};

export default config;
