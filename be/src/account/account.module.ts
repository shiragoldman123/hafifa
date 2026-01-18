import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WriteAccount, AccountSchema } from './account.schema';
import { AccountsRepository } from './account.repository';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { RabbitMQModule } from 'src/rabbit/rabbit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WriteAccount.name, schema: AccountSchema }]),
    RabbitMQModule, 
  ],
  providers: [AccountService, AccountsRepository],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
