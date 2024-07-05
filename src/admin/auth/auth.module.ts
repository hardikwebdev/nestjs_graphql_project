import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from 'src/guards/local.strategy';
import { EmailService } from 'src/email/email.service';

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
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtService,
    LocalStrategy,
    EmailService,
  ],
  exports: [AuthService, JwtService, LocalStrategy],
})
export class AuthModule {}
