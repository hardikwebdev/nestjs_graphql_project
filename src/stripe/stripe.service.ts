import { HttpStatus, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Retrieve stripe payment intent
   * @param id
   * @returns
   */
  async retrievePaymentIntent(id: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
      return paymentIntent;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  /**
   * construct stripe event
   * @param payload
   * @param signature
   * @param secret
   * @returns
   */
  async constructEvent(
    payload: any,
    signature: string,
    secret: string,
  ): Promise<Stripe.Event> {
    try {
      return await this.stripe.webhooks.constructEventAsync(
        payload,
        signature,
        secret,
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
