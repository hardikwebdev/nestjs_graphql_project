import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateSubscriptionPlanInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  description: string;
}
