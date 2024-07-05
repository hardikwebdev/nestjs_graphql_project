import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { AdminJwtStrategy } from 'src/guards/admin_guard/admin_jwt.strategy';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { HelperService } from 'src/helper.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ProductService,
    ProductsResolver,
    AdminJwtStrategy,
    AuthService,
    JwtService,
    EmailService,
    HelperService,
    AwsService,
  ],
})
export class ProductModule {}
