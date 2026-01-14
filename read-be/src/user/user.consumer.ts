import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReadUsersService } from './readUser.service';
import { ExternalUser } from './user.dto';

@Controller()
export class UsersConsumer {
  constructor(private readonly readUsersService: ReadUsersService) {}

  @EventPattern('user.created')
  async handleCreated(@Payload() user: ExternalUser) {
    await this.readUsersService.createUser(user);
  }

  @EventPattern('user.account.connected')
  async handleConnect(@Payload() data: { accountId: string; userId: string }) {
    await this.readUsersService.connect(data.accountId, data.userId);
  }

  @EventPattern('user.account.disconnected')
  async handleDisconnect(@Payload() data: { accountId: string; userId: string }) {
    await this.readUsersService.disconnect(data.accountId, data.userId);
  }
}
