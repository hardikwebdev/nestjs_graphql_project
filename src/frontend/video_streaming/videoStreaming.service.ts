import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ListVideoStreamingInput } from 'src/admin/video_streaming/dto/listVideoStreaming.input';
import { SORT_ORDER, STATUS } from 'src/constants';
import { Users } from 'src/database/entities/user.entity';
import { UserVideoBookmarks } from 'src/database/entities/user_video_bookmark.entity';
import { VideoStreaming } from 'src/database/entities/video_streaming.entity';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class FrontEndVideoStreamingService {
  constructor(
    @Inject('VIDEO_STREAMING_REPOSITORY')
    private readonly videoStreamingRepository: Repository<VideoStreaming>,
    @Inject('USER_VIDEO_BOOKMARKS_REPOSITORY')
    private readonly userVideoBookmarksRepository: Repository<UserVideoBookmarks>,
  ) {}

  /**
   * Get all videos for streaming
   * @param listVideoStreamingInput
   * @returns
   */
  async getAllVideoForStreaming(
    listVideoStreamingInput: ListVideoStreamingInput,
    user: Users,
  ) {
    const { page, pageSize, search } = listVideoStreamingInput;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<VideoStreaming> =
      this.videoStreamingRepository
        .createQueryBuilder('videoStreaming')
        .skip(skip)
        .take(pageSize)
        .orderBy(`videoStreaming.sequence_id`, 'ASC');
    if (search) {
      queryBuilder.andWhere(
        '(videoStreaming.title LIKE :search OR videoStreaming.description LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }
    const [videos, total]: any = await queryBuilder.getManyAndCount();

    const isVideoBookmarked = await this.userVideoBookmarksRepository.find({
      where: {
        user_id: user.id,
        video_id: In(videos.map((video) => video.id)),
        status: STATUS.ACTIVE,
      },
    });

    const bookmarkedVideoIds = new Set(
      isVideoBookmarked.map((bookmark) => bookmark.video_id),
    );

    videos.forEach((video) => {
      video.is_bookmarked = bookmarkedVideoIds.has(video.id);
    });

    return { videos, total };
  }

  /**
   * Get video streaming by findData
   * @param whereOption
   * @returns
   */
  async getVideoByData(whereOption: Partial<VideoStreaming>) {
    const video = await this.videoStreamingRepository.findOne({
      where: whereOption,
    });
    if (!video) {
      throw new GraphQLError('Video not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return video;
  }

  /**
   * Add and remove video bookmark
   * @param videoId
   * @param type
   * @param user
   */
  async addAndRemoveVideoBookmark(videoId: number, type: string, user: Users) {
    const isVideoExist: any = await this.videoStreamingRepository.findOne({
      where: { id: videoId, status: STATUS.ACTIVE },
    });

    if (!isVideoExist) {
      throw new GraphQLError('Video not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const isVideoBookmarkExist =
      await this.userVideoBookmarksRepository.findOne({
        where: { video_id: videoId, user_id: user.id },
      });

    let msg: string;
    let is_bookmarked = false;

    if (type === 'add') {
      if (isVideoBookmarkExist) {
        throw new GraphQLError('Video already bookmarked!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
      await this.userVideoBookmarksRepository.save({
        user_id: user.id,
        video_id: videoId,
      });

      is_bookmarked = true;
      msg = 'Video bookmarked successfully!';
    } else if (type === 'remove') {
      if (!isVideoBookmarkExist) {
        throw new GraphQLError('Video already removed from bookmark!', {
          extensions: {
            statusCode: HttpStatus.BAD_REQUEST,
          },
        });
      }
      await this.userVideoBookmarksRepository.softDelete({
        user_id: user.id,
        video_id: videoId,
      });
      msg = 'Video removed from bookmark successfully!';
    } else {
      throw new GraphQLError('Invalid type!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    isVideoExist.is_bookmarked = is_bookmarked;

    return {
      videos: isVideoExist,
      message: msg,
    };
  }

  /**
   * Get all bookmark videos
   * @param user
   * @param listAllBookamarkVideosData
   * @returns
   */
  async getAllBookmarkVideos(
    user: Users,
    listAllBookamarkVideosData: ListVideoStreamingInput,
  ) {
    const { page, pageSize, sortBy } = listAllBookamarkVideosData;
    const sortOrder: any = listAllBookamarkVideosData.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<UserVideoBookmarks> =
      this.userVideoBookmarksRepository
        .createQueryBuilder('user_video_bookmarks')
        .leftJoinAndSelect(
          'user_video_bookmarks.videoStreaming',
          'videoStreaming',
        )
        .where(
          'user_video_bookmarks.user_id = :userId AND user_video_bookmarks.status = :status AND videoStreaming.status = :status',
          { userId: user.id, status: STATUS.ACTIVE },
        )
        .andWhere(
          new Brackets((qb) => {
            if (listAllBookamarkVideosData.search) {
              qb.where(
                '(videoStreaming.title LIKE :search OR videoStreaming.description LIKE :search)',
                {
                  search: `%${listAllBookamarkVideosData.search}%`,
                },
              );
            }
          }),
        )
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `user_video_bookmarks.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    const [videos, total] = await queryBuilder.getManyAndCount();

    return { videos, total };
  }
}
