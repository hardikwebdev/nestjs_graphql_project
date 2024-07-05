import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListOrderDetailsInput extends CommonListingInputType {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  search: string;
}
