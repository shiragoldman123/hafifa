import { Injectable } from "@nestjs/common";
import { UserRepository } from '../user/user.repository';
import { CreateUserInputDto } from "./user.dto";
import { User } from "./user.schema";
import { Connection, Types } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { AccountsRepository } from "src/account/account.repository";

@Injectable()
export class UserService {
    constructor(
    private readonly usersRepository: UserRepository,
    private readonly accountRepository: AccountsRepository,
    @InjectConnection() private readonly connection: Connection,
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
  findAllUsersInRange(pageNum: number, limit: number): Promise<User[]> {
    return this.usersRepository.findAllUsersInRange((pageNum -1 ) * limit, limit)
 }

  findUserByAccount(accountId: string): Promise<User> {
    const objId = new Types.ObjectId(accountId);
    return this.usersRepository.findUserByAccount(objId);
 }

  findUsersWithSource(source: string): Promise<User[]> {
    return this.accountRepository.findUsersBySource(source)
 }

  findUsersPageNum(limit: number) : Promise<number> {
    return this.usersRepository.findUsersPageNum(limit);
 }

 async connectAccountToUser(accountId: string, userId: string) {
  const session = await this.connection.startSession();

  try {
    await session.withTransaction(async () => {
      await this.usersRepository.connectAccountToUser(
      new Types.ObjectId(accountId), 
      new Types.ObjectId(userId), 
      session,
      );

      await this.accountRepository.connectUserToAccount(
      new Types.ObjectId(accountId), 
      new Types.ObjectId(userId), 
      session,
      );
    });
  } finally {
    session.endSession();
  }
}

async disconnect(accountId: string, userId: string) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.usersRepository.disconnectAccountToUser(
          new Types.ObjectId(accountId),
          new Types.ObjectId(userId),
          session,
        );

        await this.accountRepository.diconnectUserToAccount(
          new Types.ObjectId(accountId),
          session,
        );
      });
    } finally {
      session.endSession();
    }
  }
}