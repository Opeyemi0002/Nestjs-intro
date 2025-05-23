import { Exclude } from 'class-transformer';
import { Post } from 'src/post/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
    unique: true,
  })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @Exclude()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  googleId: string;

  @CreateDateColumn()
  createdate?: Date;

  @UpdateDateColumn()
  updateDate?: Date;
}
