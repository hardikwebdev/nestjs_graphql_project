import { Module } from '@nestjs/common';
import { SchoolsResolver } from './schools.resolver';
import { SchoolsService } from './schools.service';
import { DatabaseModule } from 'src/database/database.module';
import { HelperService } from 'src/helper.service';
import { AwsService } from 'src/aws/aws.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  providers: [
    SchoolsResolver,
    SchoolsService,
    HelperService,
    AwsService,
    JwtService,
  ],
})
export class SchoolsModule {}
