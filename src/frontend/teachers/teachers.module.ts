import { Module } from '@nestjs/common';
import { TeachersResolver } from './teachers.resolver';
import { TeachersService } from './teachers.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/guards/local.strategy';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/admin/auth/auth.service';
import { HelperService } from 'src/helper.service';
import { RedisService } from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';
import { FrontEndAuthService } from '../auth/auth.service';
import { TeacherJwtStrategy } from 'src/guards/teacher_guard/teacher_jwt.strategy';
import { AwsService } from 'src/aws/aws.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret:
          process.env.JWT_SCERET_KEY ||
          '3KfcgMUJSDFNhasreHJBXCAUuiqwerksac45rknsdfKJSBF',
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
    RedisModule,
    ChatModule,
  ],
  providers: [
    TeachersResolver,
    TeachersService,
    JwtService,
    LocalStrategy,
    EmailService,
    AwsService,
    AuthService,
    HelperService,
    RedisService,
    TeacherJwtStrategy,
    FrontEndAuthService,
  ],
  exports: [TeachersService, JwtService, LocalStrategy],
})
export class FrontEndTeachersModule {}
