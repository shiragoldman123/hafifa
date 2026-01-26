import { Controller } from "@nestjs/common";
import { AccountService } from "./account.service";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller() 
export class AccountConsumer {
    constructor(private readonly accountsService: AccountService) {} 

    @EventPattern('account.created')
    async handleAccountCreated (@Payload() account: any) {
        await this.accountsService.createAccount(account)
    }

    @EventPattern('account.updated')
    async handleUpdateAccount (@Payload() account: any) {
        await this.accountsService.updateAccount(account._id, account.email)
    }
}