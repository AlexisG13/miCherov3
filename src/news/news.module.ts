import { Module, HttpModule } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleRepository } from './repositories/articles.repository';
import { UsersModule } from 'src/users/users.module';
import { NYTimesProvider } from './news_providers/nytimes';
import { NewsApiProvider } from './news_providers/news_api';
import { TheGuardianProvider } from './news_providers/guardian';

@Module({
  controllers: [NewsController],
  providers: [NewsService, NYTimesProvider, NewsApiProvider, TheGuardianProvider],
  imports: [HttpModule, TypeOrmModule.forFeature([ArticleRepository]), UsersModule],
})
export class NewsModule {}
