import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { User } from 'src/users/entities/users.entity';
import { AccessToken } from './dto/access-token.dto';
import { ArticleRepository } from 'src/news/repositories/articles.repository';
import { Article } from 'src/news/entities/article.entity';
import { PasswordChangeDto } from './dto/password-change.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private readonly articlesRepository: ArticleRepository,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.signUp(authCredentialsDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<AccessToken> {
    const user = await this.usersRepository.validatePassword(
      authCredentialsDto,
    );
    if (!user) {
      throw new UnauthorizedException('Wrong username or password');
    }
    const payload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);
    return { token: accessToken };
  }

  async saveArticle(user: User, articleUrl: string): Promise<Article> {
    return this.articlesRepository.saveArticle(user, articleUrl);
  }

  async getArticles(userId: number): Promise<Article[]> {
    return this.usersRepository.getArticles(userId);
  }

  async changePassword(
    user: User,
    passwordDto: PasswordChangeDto,
  ): Promise<void> {
    return this.usersRepository.changePassword(user, passwordDto);
  }
}
