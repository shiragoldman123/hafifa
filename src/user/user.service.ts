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

 async createUser(user: CreateUserInputDto): Promise<User> {
    return this.usersRepository.createUser({ fullName: `${user.firstName} ${user.lastName}`, ...user})
 } 

 async findUserByIdentityCard(identityCard: string): Promise<User> {
    return this.usersRepository.findUserByIdentityCard(identityCard);
 }
 
 // TO-DO : ask about the fullname in the url path

 async findAllUsersInRange(pageNum: number, limit: number): Promise<User[]> {
    return this.usersRepository.findAllUsersInRange((pageNum -1 ) * limit, limit)
 }

 async findUserByAccount(accountId: ObjectId): Promise<User> {
    return this.usersRepository.findUserByAccount(accountId);
 }
}