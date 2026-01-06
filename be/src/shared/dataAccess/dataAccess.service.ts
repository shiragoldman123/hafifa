import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { removeNullFields } from 'src/common/utils';
import envConfig from 'src/config/env.config';

@Injectable()
export class DataAccessService {
  async getData() {
    try {
      const data = await axios.get(envConfig.source.getAllUrl);

      return data.data.map(removeNullFields) as any[];
    } catch (error: any) {
      console.log(error.data);
      return null;
    }
  }
}
