import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import {
  BlogsAndNews,
  ContentType,
} from 'src/database/entities/blogs_news.entity';
import { HelperService } from 'src/helper.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateBlogAndNewsInput } from './dto/createBlogAndNews.input';
import { updateBlogAndNewsInput } from './dto/updateBlogAndNews.input';
import { GraphQLError } from 'graphql';
import { ListBlogAndNewsInputType } from './dto/listBlogAndNews.input';
import { SORT_ORDER } from 'src/constants';
@Injectable()
export class BlogsAndNewsService {
  constructor(
    @Inject('BLOG_NEWS_REPOSITORY')
    private readonly blogAndNewsRespository: Repository<BlogsAndNews>,
    private readonly helperService: HelperService,
    private readonly awsService: AwsService,
  ) {}

  /**
   * Find product by id
   * @param id
   * @returns
   */
  async findBlogOrNewsById(id: number) {
    const blogOrNews = await this.blogAndNewsRespository.findOneBy({ id });
    return blogOrNews;
  }

  async updateBlogOrNewsData(
    id: number,
    blogOrNewsData: Partial<BlogsAndNews>,
  ) {
    await this.blogAndNewsRespository.update({ id }, blogOrNewsData);
  }

  /**
   * Create blog or news
   * @param blogOrNews
   * @returns
   */
  async createBlogOrNews(blogOrNews: CreateBlogAndNewsInput) {
    if (!this.helperService.isBase64(blogOrNews.pdf_url)) {
      throw new HttpException(
        'Invalid base64 format for pdfUrl',
        HttpStatus.BAD_REQUEST,
      );
    }

    const uploadedPdf = await this.awsService.uploadToAWS(
      'pdf',
      blogOrNews.pdf_url,
      blogOrNews.content_type,
    );

    blogOrNews.pdf_url = uploadedPdf.Location;
    await this.blogAndNewsRespository.insert(blogOrNews);
    return {
      message: `${blogOrNews.content_type.charAt(0).toUpperCase() + blogOrNews.content_type.slice(1).toLowerCase()} created successfully!`,
    };
  }
  /**
   * Update blog or news by id
   * @param updateBlogOrNewsData
   * @param id
   * @returns
   */
  async updateBlogOrNews(
    updateBlogOrNewsData: updateBlogAndNewsInput,
    id: number,
  ) {
    const blogOrNews = await this.findBlogOrNewsById(id);

    if (!blogOrNews) {
      throw new GraphQLError(
        `${blogOrNews.content_type.toLowerCase()} not found!`,
        {
          extensions: {
            statusCode: HttpStatus.NOT_FOUND,
          },
        },
      );
    }

    if (this.helperService.isBase64(updateBlogOrNewsData.pdf_url)) {
      const uploadedPdf = await this.awsService.uploadToAWS(
        'pdf',
        updateBlogOrNewsData.pdf_url,
        blogOrNews.content_type,
      );

      updateBlogOrNewsData.pdf_url = uploadedPdf.Location;
      await this.awsService.removeFromBucket(blogOrNews.pdf_url);
    }

    await this.updateBlogOrNewsData(id, updateBlogOrNewsData);
    let type = 'Blog';
    if (blogOrNews.content_type === 'NEWS') {
      type = 'News';
    }

    return {
      message: `${type} updated successfully!`,
    };
  }
  /**
   * Delete blog or news by id
   * @param id
   * @returns
   */
  async deleteBlogOrNews(id: number) {
    const blogOrNews = await this.findBlogOrNewsById(id);

    if (!blogOrNews) {
      throw new GraphQLError(`Blog or news not found!`, {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    await this.awsService.removeFromBucket(blogOrNews.pdf_url);
    await this.blogAndNewsRespository.update(id, {
      deletedAt: new Date(),
    });
    let type = 'Blog';
    if (blogOrNews.content_type === 'NEWS') {
      type = 'News';
    }
    return {
      message: `${type} deleted successfully!`,
    };
  }
  /**
   * Get Blog Or News with pagination and sorting
   * @param listBlogAndNewsInputType
   * @returns
   */
  async getBlogsAndNews(listBlogAndNewsInputType: ListBlogAndNewsInputType) {
    const { page, pageSize, sortBy, content_type } = listBlogAndNewsInputType;

    const contentType = content_type.toUpperCase();

    const sortOrder: any = listBlogAndNewsInputType.sortOrder;
    const skip = (page - 1) * pageSize;
    if (
      !contentType ||
      (contentType !== ContentType.BLOG && contentType !== ContentType.NEWS)
    ) {
      throw new GraphQLError('Invalid content type!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    const queryBuilder: SelectQueryBuilder<BlogsAndNews> =
      this.blogAndNewsRespository
        .createQueryBuilder('blogsOrNews')
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `blogsOrNews.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        );

    queryBuilder.andWhere('(blogsOrNews.content_type = :contentType)', {
      contentType,
    });

    if (listBlogAndNewsInputType.search) {
      queryBuilder.andWhere('(blogsOrNews.title LIKE :search)', {
        search: `%${listBlogAndNewsInputType.search}%`,
      });
    }

    if (
      listBlogAndNewsInputType.status === 0 ||
      listBlogAndNewsInputType.status === 1
    ) {
      queryBuilder.andWhere('(blogsOrNews.status = :status)', {
        status: listBlogAndNewsInputType.status,
      });
    }

    const [blogsOrNews, total] = await queryBuilder.getManyAndCount();
    return { blogsOrNews, total };
  }
  async updateBlogOrNewsStatus(id: number, status: number) {
    const blogOrNews = await this.findBlogOrNewsById(id);
    if (!blogOrNews) {
      throw new GraphQLError('Blog or news not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    let type = 'Blog';
    if (blogOrNews.content_type === 'NEWS') {
      type = 'News';
    }
    await this.updateBlogOrNewsData(id, { status });
    return { message: `${type} status updated successfully!` };
  }
}
