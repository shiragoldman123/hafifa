import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { AccountService } from "./account.service";
import { CreateAccountDto, UpdateAccountDto } from "./account.dto";

@Controller('/accounts') 
export class AccountController {
    constructor(private readonly accountService: AccountService){}

    @Post('')
    createAccount(@Body() account: CreateAccountDto) {
        return this.accountService.createAccount(account)
    }

    @Patch('/:accountId')
    updateAccountsEmail(@Param('accountId') accountId: string, @Body() email: UpdateAccountDto) {
        return this.accountService.updateAccountsEmail(accountId, email.email)
    }

    @Get('')
    findAllAccounts() {
        return this.accountService.findAllAccounts();
    }

    @Get('source/:source')
    findAllAcountsFromSource(@Param('source') source: string) {
        return this.accountService.findAllAcountsFromSource(source)
    }
}