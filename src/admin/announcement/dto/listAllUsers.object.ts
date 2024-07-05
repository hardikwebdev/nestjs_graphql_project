import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Users } from 'src/database/entities/user.entity';

@ObjectType()
export class ListAllUsersObject {
  @Field(() => Int)
  total: number;

  @Field(() => [Users])
  users: Users[];
}
