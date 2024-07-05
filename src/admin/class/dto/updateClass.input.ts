import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateClassInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => ID)
  @IsNotEmpty()
  school_id: number;

  @Field(() => [ID!])
  @ArrayNotEmpty()
  subject_ids: number[];

  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  image_url: string;
}
