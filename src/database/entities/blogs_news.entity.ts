import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { STATUS } from 'src/constants';

export enum ContentType {
  BLOG = 'BLOG',
  NEWS = 'NEWS',
}

@ObjectType()
@Entity({ name: 'BlogsAndNews' })
export class BlogsAndNews extends BaseEntity {
  @Field()
  @Column({
    type: 'enum',
    enum: ContentType,
  })
  content_type: ContentType;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  pdf_url: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  school_id?: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active',
  })
  status: number;
}
