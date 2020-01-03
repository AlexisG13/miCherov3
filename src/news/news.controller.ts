import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { Observable } from 'rxjs';
import { News } from './interfaces /news.interface';
import { NewsFilterDto } from './dto/get-news-filter.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  getNews(@Query() newsFilterDto: NewsFilterDto): Observable<News[]> {
    return this.newsService.searchNews(newsFilterDto);
  }
}
