import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { RequestType } from 'src/constants';

@InputType()
export class CreateTimeOffInputType {
  @Field()
  @IsNotEmpty()
  @IsString()
  reason: string;

  @Field()
  @IsNotEmpty()
  type: RequestType;

  @Field()
  @IsNotEmpty()
  start_date: Date;

  @Field()
  @IsNotEmpty()
  end_date: Date;

  @Field({ nullable: true })
  start_time?: string;

  @Field({ nullable: true })
  end_time?: string;

  @Field(() => ID!, { nullable: true })
  user_id?: number;
}
