import { Controller, Get, OnApplicationBootstrap } from '@nestjs/common';
import { AppService } from './app.service';
import { CronService } from './cron/cron.service';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(
    private readonly appService: AppService,
    private readonly cronService: CronService,
  ) {}

  onApplicationBootstrap() {
    this.cronService.handleCronjobs();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
