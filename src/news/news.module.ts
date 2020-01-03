import { Module, HttpModule } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleRepository } from './repositories/articles.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([ArticleRepository]),
    UsersModule,
  ],
})
export class NewsModule {}
