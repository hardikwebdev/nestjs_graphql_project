import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { HelperService } from 'src/helper.service';

@Module({
  providers: [AwsService, HelperService],
  exports: [AwsService],
})
export class AwsModule {}
