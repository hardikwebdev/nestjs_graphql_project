import { Inject, Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: firebase.app.App,
  ) {}

  /**
   * send notification to user device
   * @param notification
   */
  async sendNotification(
    notification: firebase.messaging.Message[],
  ): Promise<void> {
    try {
      await this.firebaseAdmin.messaging().sendEach(notification);
    } catch (error) {
      console.error('Error sendNotification', error);
    }
  }
}
