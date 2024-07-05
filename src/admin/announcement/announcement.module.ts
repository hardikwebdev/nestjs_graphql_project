import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AnnouncementService } from './announcement.service';
import { AnnouncementResolver } from './announcement.resolver';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [DatabaseModule, NotificationModule],
  providers: [AnnouncementService, AnnouncementResolver, NotificationService],
})
export class AnnouncementModule {}
