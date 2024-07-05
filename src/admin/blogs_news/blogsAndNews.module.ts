import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AdminJwtStrategy } from 'src/guards/admin_guard/admin_jwt.strategy';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { HelperService } from 'src/helper.service';
import { AwsService } from 'src/aws/aws.service';
import { BlogsAndNewsService } from './blogsAndNews.service';
import { BlogsAndNewsResolver } from './blogsAndNews.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [
    BlogsAndNewsService,
    BlogsAndNewsResolver,
    AdminJwtStrategy,
    AuthService,
    JwtService,
    EmailService,
    HelperService,
    AwsService,
  ],
})
export class BlogsAndNewsModule {}
