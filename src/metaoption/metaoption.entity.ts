import { Post } from 'src/post/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;
  @OneToOne(() => Post, (post) => post.metaOptions)
  post: Post;

  @CreateDateColumn()
  createdate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
