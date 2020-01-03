import { News } from '../interfaces /news.interface';

type parserType<T> = (res: T) => News[];
type buildUrlType = (search: string, apiKey: string) => string;

export class ProviderDto<T> {
  apiKey: string;
  url: string;
  parser: parserType<T>;
  buildUrl: buildUrlType;
  constructor(url: string, parser: parserType<T>, buildUrl: buildUrlType) {
    this.apiKey = '';
    this.url = url;
    this.parser = parser;
    this.buildUrl = buildUrl;
  }

  init(apiKey: string | undefined): ProviderDto<T> {
    this.apiKey = apiKey ? apiKey : '';
    return this;
  }
}

export interface Provider<T> {
  url: string;
  apiKey: string;
  parser: parserType<T>;
  buildUrl: buildUrlType;
}
