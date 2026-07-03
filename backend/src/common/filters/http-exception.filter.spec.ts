import {
  ArgumentsHost,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DuplicateResourceException } from '../exceptions/duplicate-resource.exception';
import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  const createHost = () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status,
        }),
      }),
    } as unknown as ArgumentsHost;

    return { host, status, json };
  };

  it('formats 400 bad request errors', () => {
    const { host, status, json } = createHost();

    filter.catch(
      new BadRequestException({
        message: ['name should not be empty'],
      }),
      host,
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          message: 'name should not be empty',
          details: ['name should not be empty'],
        }),
      }),
    );
  });

  it('formats 404 not found errors', () => {
    const { host, status, json } = createHost();

    filter.catch(new NotFoundException('Product not found.'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'NOT_FOUND',
          message: 'Product not found.',
        }),
      }),
    );
  });

  it('formats 409 conflict errors', () => {
    const { host, status, json } = createHost();

    filter.catch(
      new DuplicateResourceException('Duplicated resource.', ['name', 'category']),
      host,
    );

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'DUPLICATE_RESOURCE',
          message: 'Duplicated resource.',
          details: ['name', 'category'],
        }),
      }),
    );
  });

  it('formats unexpected errors as 500', () => {
    const { host, status, json } = createHost();

    filter.catch(new Error('Unexpected failure'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          code: 'INTERNAL_ERROR',
          message: 'Internal server error.',
          details: [],
        }),
      }),
    );
  });
});
