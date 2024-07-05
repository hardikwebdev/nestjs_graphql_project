import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  MediaType,
  ReimbursementRequests,
} from 'src/database/entities/reimbursement_receipt.entity';

registerEnumType(MediaType, {
  name: 'MediaType',
});
@ObjectType()
export class ListReimbursmentObjectType {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => [MediaType], { nullable: true })
  type?: MediaType[];

  @Field(() => [ReimbursementRequests], { nullable: true })
  reimbursment?: ReimbursementRequests[];
}
