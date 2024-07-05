import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBlogAndNewsInput } from './dto/createBlogAndNews.input';
import { BlogsAndNewsService } from './blogsAndNews.service';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { updateBlogAndNewsInput } from './dto/updateBlogAndNews.input';
import { ListBlogAndNewsInputType } from './dto/listBlogAndNews.input';
import { ListBlogAndNewsObjectType } from './dto/listBlogAndNews.object';

@Resolver()
export class BlogsAndNewsResolver {
  constructor(private readonly blogAndNewsService: BlogsAndNewsService) {}
  /**
   * Create blog or news
   * @param blogOrNews
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminCreateBlogOrNews(
    @Args('createBlogOrNewsInput') createBlog: CreateBlogAndNewsInput,
  ) {
    return await this.blogAndNewsService.createBlogOrNews(createBlog);
  }
  /**
   * Update blog or news by id
   * @param updateBlogOrNewsData
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateBlogOrNews(
    @Args('updateBlogOrNewsInput') updateBlog: updateBlogAndNewsInput,
    @Args('id', { type: () => ID! }) id: number,
  ) {
    return await this.blogAndNewsService.updateBlogOrNews(updateBlog, id);
  }
  /**
   * Delete blog or news by id
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteBlogOrNews(@Args('id', { type: () => ID! }) id: number) {
    return await this.blogAndNewsService.deleteBlogOrNews(id);
  }
  /**
   * Get Blog Or News with pagination and sorting
   * @param listBlogAndNewsInputType
   * @returns
   */
  @Query(() => ListBlogAndNewsObjectType)
  @UseGuards(JwtAdminAuthGuard)
  async adminListBlogAndNews(
    @Args('listBlogAndNewsInputType')
    listBlogAndNewsInputType: ListBlogAndNewsInputType,
  ) {
    return await this.blogAndNewsService.getBlogsAndNews(
      listBlogAndNewsInputType,
    );
  }

  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateBlogOrNewsStatus(
    @Args('id', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.blogAndNewsService.updateBlogOrNewsStatus(id, status);
  }
}
