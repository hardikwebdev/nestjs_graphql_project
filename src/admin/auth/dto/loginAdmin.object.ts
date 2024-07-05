import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { RolesPermissions } from 'src/database/entities/roles_permissions.entity';

@ObjectType()
export class LoginAdminObjectType extends MessageObject {
  @Field()
  token: string;

  @Field(() => ID)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  role: number;

  @Field(() => [RolesPermissions], { nullable: true })
  permissions: RolesPermissions[];
}
