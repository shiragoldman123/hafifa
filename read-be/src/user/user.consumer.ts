import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { SearchService } from "src/elasticsearch/elasticsearch.service";
import { ReadUsersService } from "./readUser.service";
import { ExternalUser } from "./user.dto";

@Controller()
export class UsersConsumer {
  constructor(
    private readonly readUsersService: ReadUsersService,
    private readonly searchService: SearchService,
  ) {}

  @EventPattern('user.created')
  async handleCreated(@Payload() user: ExternalUser) {
    const createdUser = await this.readUsersService.createUser(user);
    await this.indexUser(createdUser);
  }

  @EventPattern('user.account.connected')
  async handleConnect(@Payload() data: { accountId: string; userId: string }) {
    console.log('got to user consumer connect');
    const updatedUser = await this.readUsersService.connect(data.accountId, data.userId);
    await this.indexUser(updatedUser);
  }

  @EventPattern('user.account.disconnected')
  async handleDisconnect(@Payload() data: { accountId: string; userId: string }) {
    const updatedUser = await this.readUsersService.disconnect(data.accountId, data.userId);
    await this.indexUser(updatedUser);
  }

    // Helper method to index user
  private async indexUser(user: any) {
    if (!user) return;
    
    await this.searchService.indexDocument(
      'users',
      user._id.toString(),
      {
        username: user.username,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        accounts: (user.accounts || []).map((account: any) => ({
          id: account._id?.toString() || account,
          identifier: account.identifier,
          source: account.source,
          email: account.email,
        })),
      },
    );
  }
}