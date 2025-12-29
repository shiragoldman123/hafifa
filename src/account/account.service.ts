import { Injectable } from "@nestjs/common";
import { AccountsRepository } from "./account.repository";
import { createdAccount } from "./account.dto";
import { Types } from "mongoose";

@Injectable()
export class AccountService {
    constructor(private readonly accountsRepository: AccountsRepository){}

    createAccount(accountDto: createdAccount) {
        return this.accountsRepository.createAccount(accountDto);
    }

    updateAccountsEmail(accountId: string, email: string) {
        return this.accountsRepository.updateAccountsEmail(new Types.ObjectId(accountId), email);
    }

    findAllAcountsFromSource(source: string) {
        return this.accountsRepository.findUsersBySource(source);
    }
}