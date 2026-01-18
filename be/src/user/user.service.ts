import { Injectable } from '@nestjs/common';
import { UserWriteRepository } from './userWrite.repository';
import { CreateUserInputDto } from './user.dto';
import { Types } from 'mongoose';
import { AccountService } from 'src/account/account.service';
import { UserWrite } from './userWrite.schema';
import { RabbitMQService } from 'src/rabbit/rabbitmq.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserWriteRepository,
    private readonly accountService: AccountService,
    private readonly rabbitmq: RabbitMQService,
  ) {}

  async createUser(user: CreateUserInputDto): Promise<UserWrite> {
    const createdUser = await this.usersRepository.createUser({ fullName: `${user.firstName} ${user.lastName}`, ...user });

    await firstValueFrom(this.rabbitmq.emit('user.created', createdUser));

    return createdUser;
  }

  async connect(accountId: string, userId: string) {
    const accId = new Types.ObjectId(accountId);
    const usrId = new Types.ObjectId(userId);

    await Promise.all([this.accountService.findAccountById(accountId), this.usersRepository.findUserById(usrId)]);

    try {
      await this.usersRepository.connectAccountToUser(accId, usrId);
      await this.accountService.connectUserToAccount(accountId, userId);

      await firstValueFrom(this.rabbitmq.emit('user.account.connected', { accountId, userId }));

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

      await firstValueFrom(this.rabbitmq.emit('user.account.disconnected', { accountId, userId }));

      return { ok: true };
    } catch (err) {
      throw err;
    }
  }
}
