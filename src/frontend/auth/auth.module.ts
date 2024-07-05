import { Module } from '@nestjs/common';
import { FrontEndResolver } from './auth.resolver';
import { FrontEndAuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/guards/local.strategy';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/admin/auth/auth.service';
import { HelperService } from 'src/helper.service';
import { RedisService } from 'src/redis/redis.service';
import { TeacherParentJwtStrategy } from 'src/guards/parent_teacher_guard/parent_teacher_jwt.strategy';
import { RedisModule } from 'src/redis/redis.module';

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
  ],
  providers: [
    FrontEndResolver,
    FrontEndAuthService,
    JwtService,
    LocalStrategy,
    EmailService,
    AuthService,
    HelperService,
    RedisService,
    TeacherParentJwtStrategy,
  ],
  exports: [FrontEndAuthService, JwtService, LocalStrategy],
})
export class FrontEndAuthModule {}
