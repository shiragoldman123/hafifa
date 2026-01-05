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
    this.accountRepository.findAccountById(new Types.ObjectId(accountId));
    this.usersRepository.findUserById(new Types.ObjectId(userId));

  try {
    await this.usersRepository.connectAccountToUser(
     new Types.ObjectId(accountId), 
     new Types.ObjectId(userId), 
    ); 
    await this.accountRepository.connectUserToAccount(
     new Types.ObjectId(accountId), 
     new Types.ObjectId(userId), 
    )
  } catch (error) {
    this.disconnect(accountId, userId);
  }
}

async disconnect(accountId: string, userId: string) {
     this.accountRepository.findAccountById(new Types.ObjectId(accountId));
    this.usersRepository.findUserById(new Types.ObjectId(userId));
  try {
    await this.usersRepository.disconnectAccountToUser(
     new Types.ObjectId(accountId), 
     new Types.ObjectId(userId), 
    ); 
    await this.accountRepository.diconnectUserToAccount(
     new Types.ObjectId(accountId), 
    )
  } catch (error) {
    this.connect(accountId, userId);
  }
  }
}