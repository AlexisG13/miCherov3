import { IsDefined } from 'class-validator';

export class ArticleDto {
  @IsDefined()
  articleUrl: string;
  constructor(articleUrl: string) {
    this.articleUrl = articleUrl;
  }
}
