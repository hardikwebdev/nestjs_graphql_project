import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class GetTeacherOfSchoolInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  search: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Field(() => Int, { nullable: true, defaultValue: 25 })
  pageSize?: number;
}
