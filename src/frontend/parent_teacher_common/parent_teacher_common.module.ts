import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FrontendParentTeacherCommonResolver } from './parent_teacher_common.resolver';
import { FrontendParentTeacherCommonService } from './parent_teacher_common.service';
import { HelperService } from 'src/helper.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    FrontendParentTeacherCommonResolver,
    FrontendParentTeacherCommonService,
    HelperService,
    AwsService,
  ],
})
export class FrontendParentTeacherCommonModule {}
