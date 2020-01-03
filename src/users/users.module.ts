import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from 'src/news/news.module';
import { ArticleRepository } from 'src/news/repositories/articles.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UsersService, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UsersRepository]),
    TypeOrmModule.forFeature([ArticleRepository]),
  ],
  exports: [UsersService, JwtStrategy, PassportModule],
  controllers: [UsersController],
})
export class UsersModule {}
