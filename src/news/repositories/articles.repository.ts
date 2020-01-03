import { EntityRepository, Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { User } from 'src/users/entities/users.entity';

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article> {
  async saveArticle(user: User, articleUrl: string): Promise<Article> {
    const newArticle = new Article(articleUrl, user);
    await this.save(newArticle);
    return newArticle;
  }
}
