import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PushNotificationResolver } from './push_notifications.resolver';
import { PushNotificationService } from './push_notifications.service';

@Module({
  exports: [],
  imports: [DatabaseModule],
  providers: [PushNotificationResolver, PushNotificationService],
})
export class PushNotificationModule {}
