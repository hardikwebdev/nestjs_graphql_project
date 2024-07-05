import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';

@ObjectType()
export class UpdateParentTeacherProfileObject extends MessageObject {
  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  phone_number?: string;

  @Field({ nullable: true })
  profile_image?: string;

  @Field({ nullable: true })
  position?: string;
}
