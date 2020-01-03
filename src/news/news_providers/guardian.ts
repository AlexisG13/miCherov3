import { ProviderDto } from '../dto/provider.dto';
import { Guardian, News, ApiProvider } from '../interfaces /news.interface';

const url2 = 'https://content.guardianapis.com/search?&show-fields=byline';

function parser(res: Guardian): News[] {
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

function buildUrl(search: string, apiKey: string): string {
  return url2 + `&api-key=${apiKey}&q=${search}`;
}

export const guardianProvider = new ProviderDto<Guardian>(url2, parser, buildUrl);
