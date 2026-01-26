import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './account.repository';
import { CreateAccountDto } from './account.dto';
import { Types } from 'mongoose';
import { ReadAccount } from './account.schema';
import { UserRead } from 'src/user/userRead.schema';

@Injectable()
export class AccountService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  createAccount(accountDto: CreateAccountDto) {
    return this.accountsRepository.createAccount(accountDto);
  }

  updateAccount(accountId: string, email: string): Promise<void> {
    return this.accountsRepository.updateAccountsEmail(new Types.ObjectId(accountId), email);
  }

  findAllAcountsFromSource(source: string): Promise<ReadAccount[]> {
    return this.accountsRepository.findAllAcountsFromSource(source);
  }

  findUsersBySource(source: string): Promise<UserRead[]> {
    return this.accountsRepository.findUsersBySource(source);
  }

  findAccountById(accountId: string): Promise<ReadAccount> {
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

  findAllAccounts(): Promise<ReadAccount[]> {
    return this.accountsRepository.findAllAccounts();
  }
  
  findAccountByIdentifier(identifier: string) {
    return this.accountsRepository.findAccountByIdentifier(identifier);
  }
}
