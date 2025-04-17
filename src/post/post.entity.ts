import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { postType } from './enum/postType.enum';
import { postStatus } from './enum/poststatus.enum';
import { createPostMetaOptionsDto } from './DTOs/createpost.metaoptions.dto';

@Entity()
export class post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
  })
  title: string;

  @Column()
  postType: postType;

  @Column()
  slug: string;

  @Column()
  status: postStatus;

  @Column()
  content?: string;

  @Column()
  schema?: string;

  @Column()
  featuredImageUrl?: string;

  @Column()
  publishON?: Date;

  @Column()
  tags?: string[];

  @Column()
  metaOptions?: createPostMetaOptionsDto[];
}
