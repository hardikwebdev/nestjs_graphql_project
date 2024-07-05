import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateClassInputType {
  @Field()
  name: string;

  @Field()
  description: string;
}
