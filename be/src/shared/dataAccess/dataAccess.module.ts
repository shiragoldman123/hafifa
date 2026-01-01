import { Module } from '@nestjs/common';
import { DataAccessService } from './dataAccess.service';

@Module({
  imports: [],
  providers: [DataAccessService],
  exports: [DataAccessService]
})
export class DataAccessModule {}