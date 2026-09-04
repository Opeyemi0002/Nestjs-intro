import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { postType } from './enum/posttype.enum';
import { postStatus } from './enum/poststatus.enum';
import { User } from 'src/users/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    type: 'varchar',
    length: 90,
  })
  title: string;

  @Column({
    nullable: true,
    type: 'text',
  })
  content?: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
  })
  postType: postType;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
  })
  postStatus: postStatus;

  @Column({
    nullable: true,
    type: 'varchar',
    length: 90,
  })
  slug?: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  schema?: string;

  @Column({
    nullable: true,
    type: 'varchar',
  })
  featuredImage?: string;

  @Column({
    nullable: false,
    type: Date,
  })
  publishedOn: Date;

  @Column({
    type: 'integer',
    nullable: true,
    array: true,
  })
  tags: number[];

  // @OneToMany(() => Metaoption, (metaoption) => metaoption.post)
  // metaOptions: Metaoption[];

  @ManyToOne(() => User, (user) => user.posts, { cascade: true })
  author: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
