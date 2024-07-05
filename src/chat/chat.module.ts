import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { DatabaseModule } from 'src/database/database.module';
import { ChatService } from './chat.service';
import { HelperService } from 'src/helper.service';
import { AuthService } from 'src/admin/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { AwsService } from 'src/aws/aws.service';
import { ChatSessionManager } from './chat.session';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [DatabaseModule, NotificationModule],
  providers: [
    ChatGateway,
    ChatService,
    HelperService,
    AuthService,
    JwtService,
    EmailService,
    AwsService,
    ChatSessionManager,
    NotificationService,
  ],
  exports: [ChatService, NotificationService, ChatGateway],
})
export class ChatModule {}
