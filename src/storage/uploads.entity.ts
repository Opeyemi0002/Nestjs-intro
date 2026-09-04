import { UploadType } from './s3/enum/upload.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  key: string;

  @Column({
    type: 'enum',
    enum: UploadType,
    default: UploadType.IMAGE,
    nullable: false,
  })
  fileType: UploadType;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  mimeType: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  fileSize: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  path: string;

  @CreateDateColumn()
  createdAt: Date;
}
