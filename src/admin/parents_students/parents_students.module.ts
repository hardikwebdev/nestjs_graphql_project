import { Module } from '@nestjs/common';
import { ParentsStudentsResolver } from './parents_students.resolver';
import { ParentsStudentsService } from './parents_students.service';
import { DatabaseModule } from 'src/database/database.module';
import { HelperService } from 'src/helper.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ParentsStudentsResolver,
    ParentsStudentsService,
    HelperService,
    EmailService,
  ],
})
export class ParentsStudentsModule {}
