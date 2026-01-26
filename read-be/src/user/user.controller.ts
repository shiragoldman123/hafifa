import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReadUsersService } from './readUser.service';
import { SyncService } from 'src/elasticsearch/sync.service';

@Controller('/users')
export class UserController {
  constructor(
    private readonly usersService: ReadUsersService,
    private readonly syncService: SyncService,
  ) {}

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

  @Get('sync')
  async sync() {
    await this.syncService.syncUsers();
    return { message: 'Sync completed' };
  }

  @Get('/search')
  async search(@Query('q') query: string) {
    return await this.usersService.search(query);
  }

  @Get('/account/identifier/:identifier')
  findUserByAccountIdentifier(@Param('identifier') identifier: string) {
    return this.usersService.findUserByAccountIdentifier(identifier);
  }

  @Get('/accounts/source/:source')
  findUsersWithSource(@Param('source') source: string) {
    return this.usersService.findUsersWithSource(source);
  }
}
