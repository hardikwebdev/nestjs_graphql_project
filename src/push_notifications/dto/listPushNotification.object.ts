import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PushNotifications } from 'src/database/entities/push_notifications.entity';

@ObjectType()
export class ListPushNotificationObjectType {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [PushNotifications], { nullable: true })
  pushNotifications: PushNotifications[];
}
