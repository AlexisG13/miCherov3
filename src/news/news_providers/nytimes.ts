import { NYTimes, News } from '../interfaces /news.interface';
import { ProviderDto } from '../dto/provider.dto';

const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?&fl=headline,section_name,
   document_type,_id,pub_date,web_url,byline`;

function parser(res: NYTimes): News[] {
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

function buildUrl(search: string, apiKey: string): string {
  return url + `&api-key=${apiKey}&q=${search}`;
}

export const nyTimesProvider = new ProviderDto<NYTimes>(url, parser, buildUrl);
