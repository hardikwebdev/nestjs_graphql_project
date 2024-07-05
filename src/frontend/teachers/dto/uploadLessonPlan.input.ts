import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class UploadLessonPlanInput {
  @Field(() => String!)
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lesson_plan_pdf: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;
}
