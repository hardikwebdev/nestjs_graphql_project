import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ContentType } from 'src/database/entities/blogs_news.entity';

@InputType()
export class CreateBlogAndNewsInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  pdf_url: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  school_id?: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  content_type: ContentType;
}
