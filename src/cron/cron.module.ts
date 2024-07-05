import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { DatabaseModule } from 'src/database/database.module';
import { AnnouncementService } from 'src/admin/announcement/announcement.service';
import { AnnouncementModule } from 'src/admin/announcement/announcement.module';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  providers: [CronService, AnnouncementService, NotificationService],
  imports: [DatabaseModule, AnnouncementModule, NotificationModule],
  exports: [CronService],
})
export class CronModule {}
