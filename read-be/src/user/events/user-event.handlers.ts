import { Injectable } from '@nestjs/common';

@Injectable()
export class UserEventHandlers {
//   constructor(private userReadRepo: UserReadRepository) {}

//   @EventPattern('user.created')
//   async handleUserCreated(data: any) {
//     console.log('Received user.created event:', data);
    
//     await this.userReadRepo.create({
//       _id: data.id,
//       name: data.name,
//       email: data.email,
//       createdAt: data.createdAt,
//     });
    
//     console.log('User saved to read database');
//   }

//   @EventPattern('user.updated')
//   async handleUserUpdated(data: any) {
//     console.log('Received user.updated event:', data);
    
//     await this.userReadRepo.update(data.id, {
//       name: data.name,
//       email: data.email,
//     });
//   }

//   @EventPattern('user.deleted')
//   async handleUserDeleted(data: any) {
//     console.log('Received user.deleted event:', data);
    
//     await this.userReadRepo.delete(data.id);
//   }
}