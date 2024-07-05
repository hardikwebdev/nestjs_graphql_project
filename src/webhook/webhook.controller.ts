import { Controller, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from 'src/stripe/stripe.service';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly webhookService: WebhookService,
  ) {}

  /**
   * Listen stripe webhook events
   * @param req
   * @param res
   * @returns
   */
  @Post('stripe')
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      const sign: any = req.headers['stripe-signature'];
      const event: any = await this.stripeService.constructEvent(
        req.rawBody,
        sign,
        process.env.STRIPE_WEBHOOK_SECRET_KEY,
      );
      if (
        event?.data?.object?.object === 'payment_intent' &&
        (event?.type === 'payment_intent.canceled' ||
          event?.type === 'payment_intent.processing' ||
          event?.type === 'payment_intent.succeeded')
      ) {
        await this.webhookService.createOrderDetailsAndPayment(
          event?.data?.object,
        );
        return res.status(200).json({ message: 'Success' });
      }

      return res.status(400).json({ message: 'Invalid event type' });
    } catch (error) {
      return res.status(400).json({ message: 'Invalid event type' });
    }
  }
}
