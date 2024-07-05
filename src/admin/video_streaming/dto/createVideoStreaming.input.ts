import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateVideoStreamingInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  title: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int!)
  total_chunks: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int!)
  current_chunk: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  chunk_video: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  file_name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  upload_id: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  upload_path: string;

  @IsNumber()
  @Field(() => Int)
  file_size: number;
}
