import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';
import { UserType } from 'src/constants';

@InputType()
export class ListAnnouncementInput extends CommonListingInputType {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  send_to?: UserType;

  @Field(() => Int, { nullable: true })
  is_published?: number;

  @Field({ nullable: true })
  publish_date_time?: string;

  @Field(() => ID, { nullable: true })
  announcementId?: number;

  @Field({ nullable: true })
  type: string;
}
