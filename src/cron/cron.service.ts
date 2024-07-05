import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { AnnouncementService } from 'src/admin/announcement/announcement.service';

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private readonly scheduleRegistry: SchedulerRegistry,
    private readonly announcementService: AnnouncementService,
  ) {}
  private cron_check = process.env.CRON_CHECK === 'true';
  onModuleInit() {}

  handleCronjobs() {
    const jobs = this.scheduleRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      console.log('This is key', key);
      let next;
      try {
        next = value.nextDate();
      } catch (error) {
        next = 'We have faced some error';
      }
      console.log(this.cron_check);
      if (this.cron_check) {
        console.log(`${key} will start ${next}`);
      } else {
        this.scheduleRegistry.deleteCronJob(key);
      }
    });
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'announcement_push_notifications',
    // disabled: true,
  })
  async handleCron() {
    await this.announcementService.pushAnnouncementNotification();
    return true;
  }
}
