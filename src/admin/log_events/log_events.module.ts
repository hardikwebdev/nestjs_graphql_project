import { Module } from '@nestjs/common';
import { LogEventsResolver } from './log_events.resolver';
import { LogEventsService } from './log_events.service';
import { DatabaseModule } from 'src/database/database.module';
import { AwsService } from 'src/aws/aws.service';
import { HelperService } from 'src/helper.service';

@Module({
  imports: [DatabaseModule],
  providers: [LogEventsResolver, LogEventsService, AwsService, HelperService],
})
export class LogEventsModule {}
