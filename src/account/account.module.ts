import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './account.schema';
import { AccountsRepository } from './account.repository';
import { AccountService } from './account.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])],
  providers: [AccountService, AccountsRepository],  
  exports: [AccountService]
})
export class AccountModule {}