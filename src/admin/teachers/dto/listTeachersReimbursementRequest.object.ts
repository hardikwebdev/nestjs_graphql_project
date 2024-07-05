import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ReimbursementRequests } from 'src/database/entities/reimbursement_receipt.entity';

@ObjectType()
export class ListTeachersReimbursementRequestObject {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => [ReimbursementRequests])
  reimbursement_requests: ReimbursementRequests[];
}
