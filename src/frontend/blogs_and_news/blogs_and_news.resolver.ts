import { Args, Query, Resolver } from '@nestjs/graphql';
import { FrontEndBlogsAndNewsService } from './blogs_and_news.service';
import { ListAllBlogsObject } from './dto/listAllBlogs.object';
import { UseGuards } from '@nestjs/common';
import { ListAllBlogsAndNewsInput } from './dto/listAllBlogsAndNews.input';
import { JwtTeacherParentAuthGuard } from 'src/guards/parent_teacher_guard/parent_teacher_jwt.guard';
import { ListAllNewsObject } from './dto/listAllNews.object';

@Resolver()
export class FrontEndBlogsAndNewsResolver {
  constructor(
    private readonly blogsAndnewsService: FrontEndBlogsAndNewsService,
  ) {}

  /**
   * Get All Blogs list added by admin
   * @param listAllBlogsData
   * @returns
   */
  @Query(() => ListAllBlogsObject)
  @UseGuards(JwtTeacherParentAuthGuard)
  async getAllBlogs(
    @Args('listAllBlogsInput') listAllBlogsData: ListAllBlogsAndNewsInput,
  ) {
    return await this.blogsAndnewsService.getAllBlogs(listAllBlogsData);
  }

  /**
   * Get All News list added by admin
   * @param listAllBlogsData
   * @returns
   */
  @Query(() => ListAllNewsObject)
  @UseGuards(JwtTeacherParentAuthGuard)
  async getAllNews(
    @Args('listAllNewsInput') listAllNewsData: ListAllBlogsAndNewsInput,
  ) {
    return await this.blogsAndnewsService.getAllNews(listAllNewsData);
  }
}
