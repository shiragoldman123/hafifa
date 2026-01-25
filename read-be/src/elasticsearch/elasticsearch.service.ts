import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
  constructor(private readonly esService: NestElasticsearchService) {}

  async onModuleInit() {
    // Check connection
    try {
      await this.esService.ping();
      console.log('Elasticsearch connected');
    } catch (error) {
      console.error('Elasticsearch connection failed:', error);
    }
  }

  async createIndex(index: string, mappings: any) {
    const exists = await this.esService.indices.exists({ index });
    
    if (!exists) {
      await this.esService.indices.create({
        index,
        mappings, 
      });
    }
  }

  async indexDocument(index: string, id: string, document: any) {
    return await this.esService.index({
      index,
      id,
      document,
    });
  }

  async search(index: string, query: any) {
    const result = await this.esService.search({
      index,
      ...query, 
    });
    

    return result.hits.hits.map(hit => {
      const source = hit._source as Record<string, any>;
      return {
        id: hit._id,
        ...source,
        score: hit._score,
      };
    });
  }

  async deleteDocument(index: string, id: string) {
    return await this.esService.delete({
      index,
      id,
    });
  }

  async updateDocument(index: string, id: string, document: any) {
    return await this.esService.update({
      index,
      id,
      doc: document,
    });
  }
}