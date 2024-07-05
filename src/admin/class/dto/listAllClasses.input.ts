import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListAllClassesInput extends CommonListingInputType {
  @Field({ nullable: true })
  search: string;

  @Field(() => Int, { nullable: true })
  status: number;

  @Field({ nullable: true })
  type: string;

  @Field(() => ID, { nullable: true })
  classId: number;

  @Field(() => ID, { nullable: true })
  schoolId: number;
}
