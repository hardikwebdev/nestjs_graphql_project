import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListTeachersReimbursementRequestInput extends CommonListingInputType {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  date?: string;

  @Field(() => ID, { nullable: true })
  teacherId?: number;

  @Field(() => Int, { nullable: true })
  status?: number;
}
