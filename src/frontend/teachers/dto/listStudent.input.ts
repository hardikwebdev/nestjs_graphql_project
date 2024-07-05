import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListStudentInputType extends CommonListingInputType {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => ID, { nullable: true })
  class_id?: number;

  @Field(() => Int, { nullable: true })
  status?: number;

  @Field({ nullable: true })
  includeWithoutClass?: boolean;

  @Field(() => String, {
    nullable: true,
    description:
      'Pass WITHOUT_PAGINATION to get all student data without pagination!',
  })
  type?: string;
}
