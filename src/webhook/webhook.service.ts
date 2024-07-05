import { HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ProductsService } from 'src/frontend/products/products.service';
import Stripe from 'stripe';

@Injectable()
export class WebhookService {
  constructor(private readonly productService: ProductsService) {}

  /**
   * Create order details or updateDetails of orders
   * @param paymentIntent
   * @returns
   */
  async createOrderDetailsAndPayment(paymentIntent: Stripe.PaymentIntent) {
    try {
      return await this.productService.checkPaymentIntentAndCreateOrder(
        paymentIntent,
      );
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }
}
