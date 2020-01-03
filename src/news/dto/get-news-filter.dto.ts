import { IsOptional, IsNotEmpty } from 'class-validator';

export class NewsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  provider: string;
  @IsNotEmpty()
  q: string;
  constructor(q: string, provider: string) {
    this.q = q;
    this.provider = provider;
  }
}
