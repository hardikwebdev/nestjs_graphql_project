import { Module } from '@nestjs/common';
import { FrontEndBlogsAndNewsResolver } from './blogs_and_news.resolver';
import { FrontEndBlogsAndNewsService } from './blogs_and_news.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [FrontEndBlogsAndNewsResolver, FrontEndBlogsAndNewsService],
})
export class FrontEndBlogsAndNewsModule {}
