import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListSubjectInput extends CommonListingInputType {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  search?: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  status?: number;

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  type?: string;
}
