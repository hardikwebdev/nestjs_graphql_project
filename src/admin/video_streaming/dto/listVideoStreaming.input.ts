import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListVideoStreamingInput extends CommonListingInputType {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  search: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  status: number;
}
