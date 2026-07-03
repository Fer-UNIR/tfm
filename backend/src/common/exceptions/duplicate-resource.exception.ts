// Excepcion de conflicto de dominio para recursos duplicados.
import { ConflictException } from '@nestjs/common';

export class DuplicateResourceException extends ConflictException {
  constructor(message: string, details: string[] = []) {
    super({
      code: 'DUPLICATE_RESOURCE',
      message,
      details,
    });
  }
}
