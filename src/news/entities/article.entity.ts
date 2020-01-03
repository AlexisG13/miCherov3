import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users/entities/users.entity';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  webUrl: string;
  @ManyToOne(
    type => User,
    user => user.articles,
  )
  user: User;
  constructor(webUrl: string, user: User) {
    super();
    this.webUrl = webUrl;
    this.user = user;
  }
}
