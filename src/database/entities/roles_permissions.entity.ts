import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { IS_ACCESSED, STATUS } from 'src/constants';
import { UserRoles } from './user_roles.entity';

@ObjectType()
@Entity({ name: 'roles_permissions' })
export class RolesPermissions extends BaseEntity {
  @Field(() => ID)
  @Column()
  role_id: number;

  @Field()
  @Column()
  module: string;

  @Field()
  @Column({
    type: 'tinyint',
    default: IS_ACCESSED.TRUE,
    comment: '0: false, 1: true',
  })
  can_add: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: IS_ACCESSED.TRUE,
    comment: '0: false, 1: true',
  })
  can_update: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: IS_ACCESSED.TRUE,
    comment: '0: false, 1: true',
  })
  can_delete: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: IS_ACCESSED.TRUE,
    comment: '0: false, 1: true',
  })
  can_view: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: inactive, 1: active',
  })
  status: number;

  @Field(() => UserRoles)
  @ManyToOne(() => UserRoles, (userRoles) => userRoles.roles_permissions)
  @JoinColumn({ name: 'role_id' })
  user_role: UserRoles;
}
