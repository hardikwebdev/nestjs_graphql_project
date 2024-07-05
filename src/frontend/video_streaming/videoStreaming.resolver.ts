import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ListVideoStreamingInput } from 'src/admin/video_streaming/dto/listVideoStreaming.input';
import { FrontEndVideoStreamingService } from './videoStreaming.service';
import { VideoStreaming } from 'src/database/entities/video_streaming.entity';
import { JwtParentAuthGuard } from 'src/guards/parent_guard/parent_jwt.guard';
import { UseGuards } from '@nestjs/common';
import { AddVideoBookmarkObject } from './dto/addVideoBookmark.object';
import { ListAllBookmarkVideosObject } from './dto/listAllBookmarkVideos.object';
import { ListAllVideosObject } from './dto/listAllVideos.object';

@Resolver()
export class FrontEndVideoStreamingResolver {
  constructor(
    private readonly frontEndVideoStreamingService: FrontEndVideoStreamingService,
  ) {}

  /**
   * get all streaming videos with search and pagination
   * @param listVideoStreamingInput
   * @returns
   */
  @Query(() => ListAllVideosObject)
  @UseGuards(JwtParentAuthGuard)
  async getAllStreamingVideos(
    @Args('listVideoStreamingInput')
    listVideoStreamingInput: ListVideoStreamingInput,
    @Context() context: any,
  ) {
    return await this.frontEndVideoStreamingService.getAllVideoForStreaming(
      listVideoStreamingInput,
      context.req.user,
    );
  }

  /**
   * Get video streaming by id
   * @param id
   * @returns
   */
  @Query(() => VideoStreaming)
  @UseGuards(JwtParentAuthGuard)
  async getVideoStreamingById(@Args('id', { type: () => ID! }) id: number) {
    return await this.frontEndVideoStreamingService.getVideoByData({ id });
  }

  /**
   * Add and remove video bookmark
   * @param videoId
   * @param type
   * @param context
   * @returns
   */
  @Mutation(() => AddVideoBookmarkObject)
  @UseGuards(JwtParentAuthGuard)
  async addAndRemoveVideoBookmark(
    @Args('videoId', { type: () => ID! }) videoId: number,
    @Args('type', { type: () => String! }) type: string,
    @Context() context: any,
  ) {
    return await this.frontEndVideoStreamingService.addAndRemoveVideoBookmark(
      videoId,
      type,
      context.req.user,
    );
  }

  /**
   * Get all bookmark videos
   * @param context
   * @param listAllBookamarkVideosData
   * @returns
   */
  @Query(() => ListAllBookmarkVideosObject)
  @UseGuards(JwtParentAuthGuard)
  async getAllBookmarkVideos(
    @Context() context: any,
    @Args('listAllBookmarkVideosInput')
    listAllBookamarkVideosData: ListVideoStreamingInput,
  ) {
    return await this.frontEndVideoStreamingService.getAllBookmarkVideos(
      context.req.user,
      listAllBookamarkVideosData,
    );
  }
}
