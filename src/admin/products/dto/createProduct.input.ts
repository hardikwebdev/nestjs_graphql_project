import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

@InputType()
export class CreateProductInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @Field(() => [String!]!, { nullable: false })
  imageUrl: string[];

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  quantity: number;

  @IsNumber()
  @Field(() => Float)
  price: number;
}
