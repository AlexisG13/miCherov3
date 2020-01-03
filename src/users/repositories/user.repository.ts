import { User } from '../entities/users.entity';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from 'src/users/dto/auth.credentials.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { Article } from 'src/news/entities/article.entity';
import { PasswordChangeDto } from '../dto/password-change.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const exists = await this.findOne({ username });
    if (exists) {
      throw new ConflictException('User already exists');
    }
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    const user = { username, password: hashedPassword, salt };
    this.save(user);
  }

  async validatePassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User | null> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }

  async changePassword(
    user: User,
    passwordDto: PasswordChangeDto,
  ): Promise<void> {
    const validate = user.validatePassword(passwordDto.password);
    if (!validate) {
      throw new UnauthorizedException('Wrong password');
    }
    const salt = await genSalt();
    const hashedPassword = await hash(passwordDto.newPassword, salt);
    user.password = hashedPassword;
    user.salt = salt;
    this.save(user);
  }

  async getArticles(userId: number): Promise<Article[]> {
    const user = await this.findOne({
      relations: ['articles'],
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.articles;
  }
}
