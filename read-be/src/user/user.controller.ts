import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInputDto } from './user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('')
  createUser(@Body() user: CreateUserInputDto) {
    return this.usersService.createUser(user);
  }

  @Get('/identityCard/:identityCard')
  findUserByIdentityCard(@Param('identityCard') identityCard: string) {
    return this.usersService.findUserByIdentityCard(identityCard);
  }

  @Get('/fullName/:fullName')
  findUserByFullName(@Param('fullName') fullName: string) {
    return this.usersService.findUserByFullName(fullName);
  }

  @Get()
  async getUsers(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.usersService.findUsersPaginated(Number(page), Number(limit));
  }

  @Get('/account/identifier/:identifier')
  findUserByAccountIdentifier(@Param('identifier') identifier: string) {
    return this.usersService.findUserByAccountIdentifier(identifier);
  }

  @Get('/accounts/source/:source')
  findUsersWithSource(@Param('source') source: string) {
    return this.usersService.findUsersWithSource(source);
  }

  @Patch('/connect/account/:accountId/user/:userId')
  connect(@Param('accountId') accountId: string, @Param('userId') userId: string) {
    return this.usersService.connect(accountId, userId);
  }

  @Delete('/disconnect/account/:accountId/user/:userId')
  diconnect(@Param('accountId') accountId: string, @Param('userId') userId: string) {
    return this.usersService.disconnect(accountId, userId);
  }
}
