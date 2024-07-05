import { Module } from '@nestjs/common';
import { ClassResolver } from './class.resolver';
import { ClassService } from './class.service';
import { DatabaseModule } from 'src/database/database.module';
import { AwsService } from 'src/aws/aws.service';
import { HelperService } from 'src/helper.service';

@Module({
  imports: [DatabaseModule],
  providers: [ClassResolver, ClassService, AwsService, HelperService],
})
export class ClassModule {}
