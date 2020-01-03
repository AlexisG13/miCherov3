import {
  Injectable,
  HttpService,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { map, catchError, reduce } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import { News, ApiProvider } from './interfaces /news.interface';
import { NewsFilterDto } from './dto/get-news-filter.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleRepository } from './repositories/articles.repository';
import { NYTimesProvider } from './news_providers/nytimes';
import { TheGuardianProvider } from './news_providers/guardian';
import { NewsApiProvider } from './news_providers/news_api';

enum providers {
  'ny',
  'guardian',
  'newsApi',
}

@Injectable()
export class NewsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(ArticleRepository)
    private readonly newsRepository: ArticleRepository,
    private readonly nyProvider: NYTimesProvider,
    private readonly tgProvider: TheGuardianProvider,
    private readonly newsApiProvider: NewsApiProvider,
  ) {}

  availableProviders = new Map()
    .set(providers[0], this.nyProvider)
    .set(providers[1], this.tgProvider)
    .set(providers[2], this.newsApiProvider);

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

  searchAllProviders(search: string): Observable<News[]> {
    const news: Array<Observable<News[]>> = [];
    this.availableProviders.forEach(provider => {
      news.push(this.searchSingleProvider(search, provider));
    });
    return merge(...news).pipe(reduce((acc, val) => [...acc, ...val]));
  }

  searchSingleProvider<T>(search: string, provider: ApiProvider<T>): Observable<News[]> {
    const query = provider.buildUrl(search);
    return this.httpService.get<T>(query).pipe(
      map(res => res.data),
      catchError(err => {
        throw new UnprocessableEntityException('An error ocurred with the provider API');
      }),
      map(provider.parse),
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
