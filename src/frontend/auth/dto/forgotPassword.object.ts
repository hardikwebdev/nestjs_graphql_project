import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';

@ObjectType()
export class ForgotPasswordObjectType extends MessageObject {
  @Field()
  otp: string;
}
