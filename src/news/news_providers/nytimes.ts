import { NYTimes, News, ApiProvider } from '../interfaces /news.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NYTimesProvider implements ApiProvider<NYTimes> {
  constructor(private readonly configService: ConfigService) {}

  url = this.configService.get('NY_API_URL');
  apiKey = this.configService.get('NY_API_KEY');

  parse(res: NYTimes): News[] {
      return res.response.docs.map(nyNew => {
        return {
          id: nyNew._id,
          title: nyNew.headline.main,
          author: nyNew.byline.original,
          publicationDate: nyNew.pub_date,
          webUrl: nyNew.web_url,
        };
    });
  }

  buildUrl(search: string): string {
    return this.url + `&api-key=${this.apiKey}&q=${search}`;
  }
}