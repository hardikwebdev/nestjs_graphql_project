import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { RequestType } from 'src/constants';
import { SickRequests } from 'src/database/entities/sick_requests.entity';

registerEnumType(RequestType, {
  name: 'RequestType',
});
@ObjectType()
export class ListTimeOffRequestObjectType {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => [RequestType], { nullable: true })
  requestTypes?: RequestType[];

  @Field(() => [SickRequests], { nullable: true })
  timeOffRequests?: SickRequests[];
}
