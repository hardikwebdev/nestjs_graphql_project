import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { LOG_EVENTS_TYPE } from 'src/constants';

@InputType()
export class AddLogEventTypeInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  event_type: LOG_EVENTS_TYPE;

  @Field()
  @IsNotEmpty()
  @IsString()
  image_url: string;
}
