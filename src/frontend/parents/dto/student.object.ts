import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';

@ObjectType()
export class StudentObjectType extends MessageObject {
  @Field()
  id: number;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  birthdate: string;

  @Field({ nullable: true })
  profile_img?: string;
}
