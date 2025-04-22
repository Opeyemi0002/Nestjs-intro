import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postType } from './enum/postType.enum';
import { postStatus } from './enum/poststatus.enum';
import { CreatePostMetaOptionsDto } from '../metaoption/Dtos/createpost.metaoptions.dto';
import { MetaOption } from 'src/metaoption/metaoption.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.POST,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 56,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true,
    length: 1024,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedOn?: Date;

  @OneToOne(() => MetaOption, (metaoption) => metaoption.post, {
    cascade: true,
    eager: true,
  })
  metaOptions?: MetaOption;

  tags?: string[];
}
