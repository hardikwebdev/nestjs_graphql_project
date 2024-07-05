import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VideoStreamingService } from './videoStreaming.service';
import { ListVideoStreamingObject } from './dto/listVideoStreaming.dto';
import { ListVideoStreamingInput } from './dto/listVideoStreaming.input';
import { VideoStreaming } from 'src/database/entities/video_streaming.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { CreateVideoStreamingInput } from './dto/createVideoStreaming.input';
import { CreateVideoObject } from './dto/createVideo.object';

@Resolver()
export class VideoStreamingResolver {
  constructor(private readonly videoStreamingService: VideoStreamingService) {}

  /**
   * Get all streaming videos for admin with search and pagination
   * @param listVideoStreamingInput
   * @returns
   */
  @Query(() => ListVideoStreamingObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetAllStreamingVideos(
    @Args('listVideoStreamingInput')
    listVideoStreamingInput: ListVideoStreamingInput,
  ) {
    return await this.videoStreamingService.getAllVideos(
      listVideoStreamingInput,
    );
  }

  /**
   * Get video streaming by id
   * @param id
   * @returns
   */
  @Query(() => VideoStreaming)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetVideoStreamingById(
    @Args('id', { type: () => ID! }) id: number,
  ) {
    return await this.videoStreamingService.getVideoByData({ id });
  }

  /**
   * Create Video streaming
   * @param createVideoStreamingInput
   * @param context
   * @returns
   */
  @Mutation(() => CreateVideoObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminCreateVideoForStream(
    @Args('createVideoStreamingInput')
    createVideoStreamingInput: CreateVideoStreamingInput,
    @Context() context: any,
  ) {
    const ip = context.req.ip;
    return await this.videoStreamingService.saveVideoInChunk(
      createVideoStreamingInput,
      ip,
    );
  }
}
