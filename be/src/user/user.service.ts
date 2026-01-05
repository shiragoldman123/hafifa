import { Injectable } from "@nestjs/common";
import { UserRepository } from '../user/user.repository';
import { CreateUserInputDto } from "./user.dto";
import { User } from "./user.schema";
import { Types } from "mongoose";
import { AccountsRepository } from "src/account/account.repository";

@Injectable()
export class UserService {
    constructor(
    private readonly usersRepository: UserRepository,
    private readonly accountRepository: AccountsRepository,
  ) {}

  createUser(user: CreateUserInputDto): Promise<User> {
    return this.usersRepository.createUser({ fullName: `${user.firstName} ${user.lastName}`, ...user})
 } 

  findUserByIdentityCard(identityCard: string): Promise<User> {
    return this.usersRepository.findUserByIdentityCard(identityCard);
 }
 
  findUserByFullName(fullName: string) : Promise<User> {
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


  findUserByAccount(accountId: string): Promise<User> {
    const objId = new Types.ObjectId(accountId);
    return this.usersRepository.findUserByAccount(objId);
 }

  findUsersWithSource(source: string): Promise<User[]> {
    return this.accountRepository.findUsersBySource(source)
 }

 async connect(accountId: string, userId: string) {
  const accId = new Types.ObjectId(accountId);
  const usrId = new Types.ObjectId(userId);

  await Promise.all([
    this.accountRepository.findAccountById(accId),
    this.usersRepository.findUserById(usrId),
  ]);

  try {
    await this.usersRepository.connectAccountToUser(accId, usrId);
    await this.accountRepository.connectUserToAccount(accId, usrId);

    return { ok: true };
  } catch (err) {
    try {
      await Promise.allSettled([
        this.usersRepository.disconnectAccountToUser(accId, usrId),
        this.accountRepository.disconnectUserToAccount(accId),
      ]);
    } catch (_) {
    }
    throw err;
  }
}

async disconnect(accountId: string, userId: string) {
  const accId = new Types.ObjectId(accountId);
  const usrId = new Types.ObjectId(userId);

  await Promise.all([
    this.accountRepository.findAccountById(accId),
    this.usersRepository.findUserById(usrId),
  ]);

  try {
    await this.usersRepository.disconnectAccountToUser(accId, usrId);
    await this.accountRepository.disconnectUserToAccount(accId);
    return { ok: true };
  } catch (err) {
    throw err;
  }
}

}