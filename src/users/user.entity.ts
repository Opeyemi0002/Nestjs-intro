import { Post } from 'src/posts/post.entity';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 92,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 92,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 92,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
    length: 1012,
  })
  password: string | null;

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  googleId: string | null;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
