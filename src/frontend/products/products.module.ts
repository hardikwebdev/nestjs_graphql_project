import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { DatabaseModule } from 'src/database/database.module';
import { ParentJwtStrategy } from 'src/guards/parent_guard/parent_jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/admin/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ProductsResolver,
    ProductsService,
    ParentJwtStrategy,
    JwtService,
    AuthService,
    EmailService,
    StripeService,
  ],
})
export class FrontEndProductsModule {}
