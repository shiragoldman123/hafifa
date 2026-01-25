import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchService } from './elasticsearch.service';
import { userMapping } from './user.mapping';
import { UserRead } from 'src/user/userRead.schema';
import { ReadAccount } from 'src/account/account.schema';

@Injectable()
export class SyncService {
  constructor(
    private readonly searchService: SearchService,
    @InjectModel(UserRead.name) private readonly userModel: Model<UserRead>,
  ) {}

  async onModuleInit() {
    setTimeout(() => {
      this.syncUsers().catch(err => {
        console.error('Initial sync failed:', err.message);
      });
    }, 5000);
  }

  async syncUsers() {
    await this.searchService.createIndex('users', userMapping);
    
    const users = await this.userModel.find().populate('accounts').exec();
    
    for (const user of users) {
    const populatedAccounts = (user.accounts || []) as unknown as ReadAccount[];
      await this.searchService.indexDocument(
        'users',
        user._id.toString(),
        {
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          birthDate: user.birthDate,
          identityCard: user.identityCard,
          gender: user.gender,
          accounts : populatedAccounts.map(account => ({
            email: account.email,
            identifier: account.identifier,
            source: account.source
          })) 
        },
      );
    }
    
    console.log(`Synced ${users.length} users to Elasticsearch`);
  }
}