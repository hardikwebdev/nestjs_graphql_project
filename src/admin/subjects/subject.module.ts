import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SubjectResolver } from './subject.resolver';
import { SubjectService } from './subject.service';
import { AwsService } from 'src/aws/aws.service';
import { HelperService } from 'src/helper.service';

@Module({
  imports: [DatabaseModule],
  providers: [SubjectResolver, SubjectService, AwsService, HelperService],
})
export class SubjectModule {}
