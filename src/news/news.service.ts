import {
  Injectable,
  HttpService,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { map, catchError, reduce } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import { News } from './interfaces /news.interface';
import { NewsFilterDto } from './dto/get-news-filter.dto';
import { ProviderDto } from './dto/provider.dto';
import { guardianProvider } from './news_providers/guardian';
import { nyTimesProvider } from './news_providers/nytimes';
import { ConfigService } from '@nestjs/config';
import { newsApiProvider } from './news_providers/news_api';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleRepository } from './repositories/articles.repository';

@Injectable()
export class NewsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(ArticleRepository)
    private readonly newsRepository: ArticleRepository,
  ) {}

  async getArticleByID(id: number): Promise<Article> {
    const found = await this.newsRepository.findOne(id);
    if (!found) {
      throw new NotFoundException('Article not found');
    }
    return found;
  }

  async getAllArticles(): Promise<Article[]> {
    const found = await this.newsRepository.find();
    if (!found) {
      throw new NotFoundException('No articles were found');
    }
    return found;
  }

  availableProviders = new Map()
    .set('ny', nyTimesProvider.init(this.configService.get<string>('NY_API_KEY')))
    .set('guardian', guardianProvider.init(this.configService.get<string>('GUARDIAN_API_KEY')))
    .set('newsApi', newsApiProvider.init(this.configService.get<string>('NEWS_API_KEY')));

  searchAllProviders(search: string): Observable<News[]> {
    const news: Array<Observable<News[]>> = [];
    this.availableProviders.forEach(provider => {
      news.push(this.searchSingleProvider(search, provider));
    });
    return merge(...news).pipe(reduce((acc, val) => [...acc, ...val]));
  }

  searchSingleProvider<T>(search: string, provider: ProviderDto<T>): Observable<News[]> {
    const query = provider.buildUrl(search, provider.apiKey);
    return this.httpService.get<T>(query).pipe(
      map(res => res.data),
      catchError(err => {
        throw new UnprocessableEntityException('An error ocurred with the provider API');
      }),
      map(provider.parser),
    );
  }

  searchNews(newsFilterDto: NewsFilterDto): Observable<News[]> {
    if (!newsFilterDto.provider) {
      return this.searchAllProviders(newsFilterDto.q);
    }
    const newsProvider = this.availableProviders.get(newsFilterDto.provider);
    if (!newsProvider) {
      throw new BadRequestException('An unknown provider was given');
    }
    return this.searchSingleProvider(newsFilterDto.q, newsProvider);
  }
}
