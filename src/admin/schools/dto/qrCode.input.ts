import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GenerateQRCodeInput {
  @Field(() => ID, { nullable: true })
  school_id: number;

  @Field({ nullable: true })
  slug: string;
}
