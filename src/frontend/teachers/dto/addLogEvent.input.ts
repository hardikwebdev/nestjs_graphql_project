import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UrlDataInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  url: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field(() => String, { nullable: true })
  @IsString()
  duration: string;

  @Field(() => String, { nullable: true })
  @IsString()
  video_thumbnail: string;
}

@InputType()
export class AddLogEventInput {
  @Field(() => ID)
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

  @Field(() => ID)
  @IsNotEmpty()
  student_id: number;

  // @Field(() => [UrlDataInput], { nullable: true })
  // url_data: UrlDataInput[];
}
