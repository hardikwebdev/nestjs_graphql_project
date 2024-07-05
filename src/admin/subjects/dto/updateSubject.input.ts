import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateSubjectInput {
  @IsNotEmpty()
  @Field(() => String!)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  sub_title: string;

  @IsString()
  @IsOptional()
  @Field(() => String)
  description: string;

  @Field(() => String)
  @IsString()
  image: string;
}
