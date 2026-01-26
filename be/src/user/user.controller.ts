import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInputDto } from './user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('')
  createUser(@Body() user: CreateUserInputDto) {
    return this.usersService.createUser(user);
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
