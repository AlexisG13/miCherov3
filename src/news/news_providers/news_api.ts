import { NewsApi, News, ApiProvider } from '../interfaces /news.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NewsApiProvider implements ApiProvider<NewsApi> {
  constructor(private readonly configService: ConfigService) {}

  url = this.configService.get('NEWS_API_URL');
  apiKey = this.configService.get('NEWS_API_KEY');

  parse(res: NewsApi): News[] {
    return res.articles.map(art => {
      return {
        id: art.source.id,
        title: art.title,
        author: art.author,
        publicationDate: art.publishedAt,
        webUrl: art.url,
      };
    });
  }

  buildUrl(search: string): string {
    return this.url + `apiKey=${this.apiKey}&q=${search}`;
  }
}
