import { Module, Global } from '@nestjs/common';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './elasticsearch.service';
import envConfig from '../config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRead, UserSchema } from 'src/user/userRead.schema';
import { SyncService } from './sync.service';

@Global()
@Module({
  imports: [
    NestElasticsearchModule.register({
      node: envConfig.elasticSearch.node,
    }),
    MongooseModule.forFeature([
      { name: UserRead.name, schema: UserSchema },
    ]),
  ],
  providers: [SearchService, SyncService],
  exports: [SearchService, SyncService], 
})
export class ElasticsearchModule {}