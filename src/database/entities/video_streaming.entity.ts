import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { STATUS } from 'src/constants';
import { UserVideoBookmarks } from './user_video_bookmark.entity';

@ObjectType()
export class VideoStreamingObject {
  @Field(() => String)
  url: string;

  @Field(() => String)
  duration: string;

  @Field(() => String)
  video_thumbnail: string;
}

@Entity({ name: 'video_streaming' })
@ObjectType()
export class VideoStreaming extends BaseEntity {
  @Field(() => String)
  @Column({ nullable: true })
  title: string;

  @Field(() => String)
  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Field(() => [VideoStreamingObject])
  @Column({ type: 'json' })
  url_data: VideoStreamingObject[];

  @Field(() => Int)
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active',
  })
  status: number;

  @Field(() => Int)
  @Column({ nullable: true })
  sequence_id: number;

  @Field(() => [UserVideoBookmarks])
  @OneToMany(
    () => UserVideoBookmarks,
    (userVideoBookmarks) => userVideoBookmarks.videoStreaming,
  )
  user_video_bookmarks: UserVideoBookmarks[];
}
