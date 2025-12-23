import { Injectable } from "@nestjs/common";
import { UserRepository } from '../user/user.repository';
import { CreateUserInputDto } from "./user.dto";
import { User } from "./user.schema";
import { ObjectId } from "mongoose";

@Injectable()
export class UserService {
    constructor(
    private readonly usersRepository: UserRepository,
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

  findUserByAccount(accountId: ObjectId): Promise<User> {
    return this.usersRepository.findUserByAccount(accountId);
 }

  findUsersWithSource(source: string): Promise<User[]> {
    return this.usersRepository.findUsersWithSource(source)
 }

  findUsersPageNum(limit: number) : Promise<number> {
    return this.usersRepository.findUsersPageNum(limit);
 }
}