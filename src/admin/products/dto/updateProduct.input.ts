import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

@InputType()
export class UpdateProductInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  quantity: number;

  @IsArray()
  @ArrayNotEmpty()
  @Field(() => [String!]!, { nullable: false })
  imageUrl: string[];

  @IsArray()
  @Field(() => [String!]!, { nullable: true })
  removedImageUrls: string[];

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Field(() => Int)
  status: number;
}
