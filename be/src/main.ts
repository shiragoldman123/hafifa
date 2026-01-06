import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import logger from 'morgan';
import { AppModule } from './app.module';
import envConfig from './config/env.config';

async function bootstrap() {
  console.log('Creating app with config:', envConfig);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(logger('dev'));
  app.enableCors({
    origin: "http://localhost:5173"
  })

  const config = new DocumentBuilder()
    .setTitle(`${envConfig.metaData.systemName + envConfig.metaData.serviceName} API`)
    .setDescription(envConfig.metaData.description)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(envConfig.service.port);
}

bootstrap()
  .then(() => {
    console.log('service started on port ' + envConfig.service.port);
  })
  .catch((err) => {
    console.log('process failed with error: ', err);
    process.exit(1);
  });

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
    process.exit(1);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
