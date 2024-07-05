import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Classes } from 'src/database/entities/classes.entity';

@ObjectType()
export class ListAssignClassesByTeacherObject {
  @Field(() => Int)
  total: number;

  @Field(() => [Classes])
  classes: Classes[];
}
