import { Field, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class Time_slots {
  @Field()
  @IsNotEmpty()
  @IsString()
  start_time: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  end_time: string;
}

@InputType()
export class CreateZoomCallTimingInput {
  @Field(() => Date)
  @IsNotEmpty()
  date: Date;

  @Field(() => [Time_slots])
  @ArrayNotEmpty()
  time_slots: Time_slots[];
}
