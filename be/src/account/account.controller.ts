import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
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

}