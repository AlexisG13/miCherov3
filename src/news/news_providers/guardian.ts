import { Guardian, News, ApiProvider } from '../interfaces /news.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TheGuardianProvider implements ApiProvider<Guardian> {
  constructor(private readonly configService: ConfigService) {}

  url = this.configService.get('TG_URL');
  apiKey = this.configService.get('GUARDIAN_API_KEY');

  parse(res: Guardian): News[] {
    return res.response.results.map(gNew => {
      return {
        id: gNew.id,
        title: gNew.webTitle,
        author: gNew.fields.byline,
        publicationDate: gNew.webPublicationDate,
        webUrl: gNew.webUrl,
      };
    });
  }

  buildUrl(search: string): string {
    return this.url + `&api-key=${this.apiKey}&q=${search}`;
  }
}
