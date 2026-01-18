import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReadAccount, AccountSchema } from './account.schema';
import { AccountsRepository } from './account.repository';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountConsumer } from './account.consumer';

@Module({
  imports: [MongooseModule.forFeature([{ name: ReadAccount.name, schema: AccountSchema }])],
  providers: [AccountService, AccountsRepository],  
  controllers: [AccountController, AccountConsumer],
  exports: [AccountService]
})
export class AccountModule {}