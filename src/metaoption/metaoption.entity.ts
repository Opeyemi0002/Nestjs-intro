import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Metaoption {
  @PrimaryGeneratedColumn()
  id: number;
}
