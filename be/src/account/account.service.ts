import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './account.repository';
import { CreateAccountDto } from './account.dto';
import { Types } from 'mongoose';
import { Account } from './account.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class AccountService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  createAccount(accountDto: CreateAccountDto): Promise<Account> {
    return this.accountsRepository.createAccount(accountDto);
  }

  updateAccountsEmail(accountId: string, email: string): Promise<void> {
    return this.accountsRepository.updateAccountsEmail(new Types.ObjectId(accountId), email);
  }

  findAllAcountsFromSource(source: string): Promise<Account[]> {
    return this.accountsRepository.findAllAcountsFromSource(source);
  }

  findUsersBySource(source: string): Promise<User[]> {
    return this.accountsRepository.findUsersBySource(source);
  }

  findAccountById(accountId: string): Promise<Account> {
    return this.accountsRepository.findAccountById(new Types.ObjectId(accountId));
  }

  connectUserToAccount(accountId: string, userId: string) {
    const accId = new Types.ObjectId(accountId);
    const usrId = new Types.ObjectId(userId);
    return this.accountsRepository.connectUserToAccount(accId, usrId);
  }

  disconnectUserToAccount(accountId: string) {
    return this.accountsRepository.disconnectUserToAccount(new Types.ObjectId(accountId));
  }

  findAllAccounts(): Promise<Account[]> {
    return this.accountsRepository.findAllAccounts();
  } 
}
