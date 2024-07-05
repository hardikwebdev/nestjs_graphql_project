import { Field, ObjectType } from '@nestjs/graphql';
import { RolesPermissions } from 'src/database/entities/roles_permissions.entity';

@ObjectType()
export class ListRolePermissionsObject {
  @Field(() => [RolesPermissions])
  permissions: RolesPermissions[];
}
