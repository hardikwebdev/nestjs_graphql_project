import { Inject, Injectable } from '@nestjs/common';
import { ListAllBlogsAndNewsInput } from './dto/listAllBlogsAndNews.input';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import {
  BlogsAndNews,
  ContentType,
} from 'src/database/entities/blogs_news.entity';
import { SORT_ORDER, STATUS } from 'src/constants';

@Injectable()
export class FrontEndBlogsAndNewsService {
  constructor(
    @Inject('BLOG_NEWS_REPOSITORY')
    private readonly blogAndNewsRespository: Repository<BlogsAndNews>,
  ) {}

  /**
   * Get All Blogs list added by admin
   * @param listAllBlogsData
   * @returns
   */
  async getAllBlogs(listAllBlogsData: ListAllBlogsAndNewsInput) {
    const { page, pageSize, sortBy } = listAllBlogsData;
    const sortOrder: any = listAllBlogsData.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<BlogsAndNews> =
      this.blogAndNewsRespository
        .createQueryBuilder('BlogsAndNews')
        .where(
          'BlogsAndNews.content_type = :type AND BlogsAndNews.status = :status',
          { type: ContentType.BLOG, status: STATUS.ACTIVE },
        )
        .andWhere(
          new Brackets((qb) => {
            if (listAllBlogsData.search) {
              qb.where('(BlogsAndNews.title LIKE :search)', {
                search: `%${listAllBlogsData.search}%`,
              });
            }
          }),
        )
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `BlogsAndNews.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    const [blogs, total] = await queryBuilder.getManyAndCount();

    return { blogs, total, message: 'Blog list fetched successfully!' };
  }

  /**
   * Get All News list added by admin
   * @param listAllNewsData
   * @returns
   */
  async getAllNews(listAllNewsData: ListAllBlogsAndNewsInput) {
    const { page, pageSize, sortBy } = listAllNewsData;
    const sortOrder: any = listAllNewsData.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<BlogsAndNews> =
      this.blogAndNewsRespository
        .createQueryBuilder('BlogsAndNews')
        .where(
          'BlogsAndNews.content_type = :type AND BlogsAndNews.status = :status',
          { type: ContentType.NEWS, status: STATUS.ACTIVE },
        )
        .andWhere(
          new Brackets((qb) => {
            if (listAllNewsData.search) {
              qb.where('(BlogsAndNews.title LIKE :search)', {
                search: `%${listAllNewsData.search}%`,
              });
            }
          }),
        )
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `BlogsAndNews.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    const [news, total] = await queryBuilder.getManyAndCount();

    return { news, total, message: 'News list fetched successfully!' };
  }
}
