import { Module } from '@nestjs/common';
import { PaginationProvider } from './providers/pagination.provider';

@Module({
  imports:[],
  providers: [PaginationProvider],
  exports: [PaginationProvider],
})
export class PaginationModule {}
