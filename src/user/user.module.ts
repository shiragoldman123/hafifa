import { Module } from '@nestjs/common';
import { UserService } from './user.service';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserRepository } from '../user/user.repository';
import { UserController } from './user.controller';
import { DataAccessModule } from 'src/shared/dataAccess/dataAccess.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), DataAccessModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
