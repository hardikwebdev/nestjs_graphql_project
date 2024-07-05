import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Classes } from 'src/database/entities/classes.entity';

@ObjectType()
export class ListAllClassesObject {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [Classes])
  classes: Classes[];
}
