import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SubscriptionPlanInterval } from 'src/constants';

@InputType()
export class CreateSubscriptionPlanInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  description: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  android_plan_id: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  ios_plan_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Float!)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int!)
  interval: SubscriptionPlanInterval;
}
