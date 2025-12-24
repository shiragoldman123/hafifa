import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserInputDto } from "./user.dto";

@Controller('/users')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post('')
    createUser(@Body() user: CreateUserInputDto) {
        return this.usersService.createUser(user);
    }

    @Get('/id/:id')
    findUserByIdentityCard(@Param('id') identityCard: string) {
        return this.usersService.findUserByIdentityCard(identityCard);
    }

    @Get('/fullName/:fullName')
    findUserByFullName(@Param('fullName') fullName: string) {
        return this.usersService.findUserByFullName(fullName);
    }

    @Get()
    findAllUsersInRange(@Query('page') page: number, @Query('limit') limit: number) {
        return this.usersService.findAllUsersInRange(page, limit);
    }

    @Get('/account/:accountId')
    findUserByAccount(@Param('accountId') accountId: string) {
        return this.usersService.findUserByAccount(accountId);
    }

    @Get('/accounts/source/:source')
    findUsersWithSource(@Param('source') source: string) {
        return this.usersService.findUsersWithSource(source);
    }


    @Get('/pageAmount/:limit') 
    findUsersPageNum(@Param('limit') limit: number) {
        return this.usersService.findUsersPageNum(limit);
    }
}