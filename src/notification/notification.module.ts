import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import * as firebase from 'firebase-admin';
import { join } from 'path';

@Module({
  providers: [
    NotificationService,
    {
      provide: 'FIREBASE_ADMIN',
      useValue: firebase.initializeApp({
        credential: firebase.credential.cert(
          join(process.cwd(), process.env.FIREBASE_CREDENTIALS_FILE_PATH),
        ),
      }),
    },
  ],
  exports: [NotificationService, 'FIREBASE_ADMIN'],
})
export class NotificationModule {}
