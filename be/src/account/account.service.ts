import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './account.repository';
import { CreateAccountDto } from './account.dto';
import { Types } from 'mongoose';
import { WriteAccount } from './account.schema';
import { RabbitMQService } from 'src/rabbit/rabbitmq.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  async createAccount(accountDto: CreateAccountDto): Promise<WriteAccount> {
    const account = await this.accountsRepository.createAccount(accountDto);

    await firstValueFrom(this.rabbitmq.emit('account.create', account));

    return account;
  }

  async updateAccountsEmail(accountId: string, email: string): Promise<void> {
    const account = await this.accountsRepository.updateAccountsEmail(new Types.ObjectId(accountId), email);

    await firstValueFrom(this.rabbitmq.emit('account.update', account));

    return account
  }

  connectUserToAccount(accountId: string, userId: string) {
    const accId = new Types.ObjectId(accountId);
    const usrId = new Types.ObjectId(userId);
    return this.accountsRepository.connectUserToAccount(accId, usrId);
  }

  disconnectUserToAccount(accountId: string) {
    return this.accountsRepository.disconnectUserToAccount(new Types.ObjectId(accountId));
  }

  findAccountById(accountId: string): Promise<WriteAccount> {
    return this.accountsRepository.findAccountById(new Types.ObjectId(accountId));
  }
}
