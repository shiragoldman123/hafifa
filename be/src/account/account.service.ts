import { Injectable } from "@nestjs/common";
import { AccountsRepository } from "./account.repository";
import { CreateAccountDto } from "./account.dto";
import { Types } from "mongoose";
import { Account } from "./account.schema";

@Injectable()
export class AccountService {
    constructor(private readonly accountsRepository: AccountsRepository){}

    createAccount(accountDto: CreateAccountDto): Promise<Account> {
        return this.accountsRepository.createAccount(accountDto);
    }

    updateAccountsEmail(accountId: string, email: string): Promise<void> {
        return this.accountsRepository.updateAccountsEmail(new Types.ObjectId(accountId), email);
    }

    findAllAcountsFromSource(source: string): Promise<Account[]> {
        return this.accountsRepository.findAllAcountsFromSource(source);
    }
}