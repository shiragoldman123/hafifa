import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { UserReadRepository } from './userRead.repository';
import { UserRead } from './userRead.schema';
import { Types } from 'mongoose';
import {  ExternalUser } from './user.dto';

@Injectable()
export class ReadUsersService {
  constructor(
    private readonly usersRepository: UserReadRepository,
    private readonly accountService: AccountService,
  ) {}


  findUserByIdentityCard(identityCard: string): Promise<UserRead> {
    return this.usersRepository.findUserByIdentityCard(identityCard);
  }

  findUserByFullName(fullName: string): Promise<UserRead[]> {
    return this.usersRepository.findUserByFullName(fullName);
  }

  async findUsersPaginated(page: number, limit: number) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(limit, 100));
    const skip = (safePage - 1) * safeLimit;

    const { data, total } = await this.usersRepository.findUsersPaginated(skip, safeLimit);

    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    return {
      data,
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    };
  }

  async findUserByAccountIdentifier(identifier: string): Promise<UserRead> {
    const account = await this.accountService.findAccountByIdentifier(identifier);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (!account.user) {
      throw new NotFoundException('Account is not connected to any user');
    }

    return this.usersRepository.findUserByAccount(account?.id);
  }

  findUsersWithSource(source: string): Promise<UserRead[]> {
    return this.accountService.findUsersBySource(source);
  }

    createUser(user: ExternalUser): Promise<UserRead> {
    return this.usersRepository.createUser(user);
  }

  async connect(accountId: string, userId: string) {
    const accId = new Types.ObjectId(accountId);
    const usrId = new Types.ObjectId(userId);

    await Promise.all([this.accountService.findAccountById(accountId), this.usersRepository.findUserById(usrId)]);

    try {
      await this.usersRepository.connectAccountToUser(accId, usrId);
      await this.accountService.connectUserToAccount(accountId, userId);

      return { ok: true };
    } catch (err) {
      try {
        await Promise.allSettled([
          this.usersRepository.disconnectAccountToUser(accId, usrId),
          this.accountService.disconnectUserToAccount(accountId),
        ]);
      } catch (_) {}
      throw err;
    }
  }

  async disconnect(accountId: string, userId: string) {
    const accId = new Types.ObjectId(accountId);
    const usrId = new Types.ObjectId(userId);

    await Promise.all([this.accountService.findAccountById(accountId), this.usersRepository.findUserById(usrId)]);

    try {
      await this.usersRepository.disconnectAccountToUser(accId, usrId);
      await this.accountService.disconnectUserToAccount(accountId);

      return { ok: true };
    } catch (err) {
      throw err;
    }
  }
}
