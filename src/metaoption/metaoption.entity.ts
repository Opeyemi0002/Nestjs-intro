import { Post } from 'src/post/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  @OneToOne(() => Post, (post) => post.metaOptions, { onDelete: 'CASCADE' })
  @JoinColumn()
  post: Post;

  @CreateDateColumn()
  createdate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
