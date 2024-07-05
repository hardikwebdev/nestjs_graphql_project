import { Module } from '@nestjs/common';
import { TeachersResolver } from './teachers.resolver';
import { TeachersService } from './teachers.service';
import { DatabaseModule } from 'src/database/database.module';
import { HelperService } from 'src/helper.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [DatabaseModule],
  providers: [TeachersResolver, TeachersService, HelperService, EmailService],
})
export class TeachersModule {}
