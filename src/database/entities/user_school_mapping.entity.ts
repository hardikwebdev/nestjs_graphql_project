import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Users } from './user.entity';
import { Schools } from './schools.entity';
import { STATUS } from 'src/constants';

@ObjectType()
@Entity({ name: 'UserSchoolMappings' })
export class UserSchoolMappings extends BaseEntity {
  @Field()
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: inactive, 1: active',
  })
  status: number;

  @Field(() => ID)
  @Column()
  schoolId: number;

  @Field(() => ID)
  @Column()
  userId: number;

  @ManyToOne(() => Users, (users) => users.userSchoolMappings)
  @JoinColumn({ name: 'userId' })
  users: Users;

  @ManyToOne(() => Schools, (schools) => schools.userSchoolMappings)
  @JoinColumn({ name: 'schoolId' })
  schools: Schools;
}
