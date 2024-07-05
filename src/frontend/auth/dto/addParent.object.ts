import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';

@ObjectType()
export class ParentsRegisterObjectType extends MessageObject {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  role: number;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field({ nullable: true })
  username?: string;

  @Field()
  status: number;

  @Field({ nullable: true })
  is_verified?: number;

  @Field({ nullable: true })
  is_mfa?: number;

  @Field()
  otp: string;

  @Field()
  token: string;
}
