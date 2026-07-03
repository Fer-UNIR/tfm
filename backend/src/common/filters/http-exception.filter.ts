// Filtro global para normalizar respuestas de error del API.
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

type ExceptionResponseBody =
  | string
  | {
      code?: string;
      message?: string | string[];
      details?: unknown[];
    };

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details: unknown[];
  };
  meta: {
    timestamp: string;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<{
      status: (statusCode: number) => {
        json: (body: ApiErrorResponse) => void;
      };
    }>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody =
      exception instanceof HttpException
        ? (exception.getResponse() as ExceptionResponseBody)
        : undefined;

    const payload: ApiErrorResponse = {
      error: {
        code: this.resolveErrorCode(statusCode, responseBody),
        message: this.resolveErrorMessage(statusCode, responseBody),
        details: this.resolveErrorDetails(responseBody),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    response.status(statusCode).json(payload);
  }

  private resolveErrorCode(
    statusCode: number,
    responseBody: ExceptionResponseBody | undefined,
  ): string {
    if (
      responseBody &&
      typeof responseBody === 'object' &&
      typeof responseBody.code === 'string'
    ) {
      return responseBody.code;
    }

    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return 'VALIDATION_ERROR';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'DUPLICATE_RESOURCE';
      default:
        return 'INTERNAL_ERROR';
    }
  }

  private resolveErrorMessage(
    statusCode: number,
    responseBody: ExceptionResponseBody | undefined,
  ): string {
    if (responseBody && typeof responseBody === 'object') {
      if (typeof responseBody.message === 'string') {
        return responseBody.message;
      }

      if (
        Array.isArray(responseBody.message) &&
        typeof responseBody.message[0] === 'string'
      ) {
        return responseBody.message[0];
      }
    }

    if (typeof responseBody === 'string') {
      return responseBody;
    }

    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return 'Validation failed.';
      case HttpStatus.NOT_FOUND:
        return 'Resource not found.';
      case HttpStatus.CONFLICT:
        return 'Resource already exists.';
      default:
        return 'Internal server error.';
    }
  }

  private resolveErrorDetails(
    responseBody: ExceptionResponseBody | undefined,
  ): unknown[] {
    if (responseBody && typeof responseBody === 'object') {
      if (Array.isArray(responseBody.details)) {
        return responseBody.details;
      }

      if (Array.isArray(responseBody.message)) {
        return responseBody.message;
      }
    }

    return [];
  }
}
