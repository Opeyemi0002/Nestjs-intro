import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from './dtos/pagination.dto';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PaginatedResponse } from './Interfaces/pagination.interface';

@Injectable()
export class PaginationService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  async paginateQuery<U extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<U>,
  ): Promise<PaginatedResponse<U>> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;

    const results = await repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;
    const nextPage = page === totalPages ? page : page + 1;
    const previousPage = page === 1 ? page : page - 1;
    const firstPage = 1;

    const baseURL = this.request.protocol + '://' + this.request.headers.host;
    const newUrl = new URL(this.request.url, baseURL);

    const finalResponse: PaginatedResponse<U> = {
      data: results,
      metaData: {
        ItemsPerPage: limit,
        totalItems,
        currentPage,
        totalPages,
      },
      links: {
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${previousPage}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${firstPage}`,

        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
      },
    };
    return finalResponse;
  }
}
