import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { UrlDataInput } from './addLogEvent.input';

@InputType()
export class UpdateLogEventInput {
  @Field(() => ID!)
  @IsNotEmpty()
  event_type_id: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => [UrlDataInput], { nullable: true })
  url_data: UrlDataInput[];

  @Field(() => [String], { nullable: true })
  removed_url: string[];
}
