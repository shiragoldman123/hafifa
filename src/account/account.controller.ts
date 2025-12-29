import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { AccountService } from "./account.service";
import { CreatedAccount } from "./account.dto";

@Controller('/accounts') 
export class AccountController {
    constructor(private readonly accountService: AccountService){}

    @Post('')
    createAccount(@Body() account: CreatedAccount) {
        return this.accountService.createAccount(account)
    }

    @Patch('/:accountId')
    updateAccountsEmail(@Param('accountId') accountId: string, @Body() email: string) {
        return this.accountService.updateAccountsEmail(accountId, email)
    }

    @Get('source/:source')
    findAllAcountsFromSource(@Param('source') source: string) {
        return this.findAllAcountsFromSource(source)
    }
}