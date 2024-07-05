import { Module } from '@nestjs/common';
import { VideoStreamingResolver } from './videoStreaming.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { VideoStreamingService } from './videoStreaming.service';
import { AwsService } from 'src/aws/aws.service';
import { AwsModule } from 'src/aws/aws.module';
import { HelperService } from 'src/helper.service';

@Module({
  imports: [DatabaseModule, AwsModule],
  providers: [
    VideoStreamingResolver,
    VideoStreamingService,
    AwsService,
    HelperService,
  ],
})
export class VideoStreamingModule {}
