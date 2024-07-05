import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';

@ObjectType()
export class EnableDisableMFACommonObjectType extends MessageObject {
  @Field(() => Int!, { nullable: false })
  is_mfa: number;
}
