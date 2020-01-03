import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { hash } from 'bcrypt';
import {Exclude} from 'class-transformer';
import { Article } from 'src/news/entities/article.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  @Exclude()
  password: string;
  @Column()
  @Exclude()
  salt: string;
  @CreateDateColumn({ default: new Date() })
  createdAt?: Date;
  @UpdateDateColumn({ default: new Date() })
  updatedAt?: Date;
  @OneToMany(
    type => Article,
    article => article.user,
    { eager: true },
  )
  articles: Article[];

  async validatePassword(password: string): Promise<boolean> {
    const validate = await hash(password, this.salt);
    return validate === this.password;
  }
  constructor(
    username: string,
    password: string,
    salt: string,
    articles: Article[],
    id: number,
  ) {
    super();
    this.id = id;
    this.username = username;
    this.password = password;
    this.salt = salt;
    this.articles = articles;
  }
}
