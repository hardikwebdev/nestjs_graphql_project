import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { DatabaseModule } from 'src/database/database.module';
import { WebhookService } from './webhook.service';
import { ProductsService } from 'src/frontend/products/products.service';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  controllers: [WebhookController],
  imports: [DatabaseModule],
  providers: [WebhookService, ProductsService, StripeService],
})
export class WebhookModule {}
