import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddNewsletterInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  pdf_url: string;

  @Field()
  @IsNotEmpty()
  publish_date_time: Date;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  class_ids: number[];
}
