# ADR-005: Uso de PATCH para actualizacion parcial de productos

- Estado: Accepted
- Fecha: 2026-07-03

## Contexto

Durante Fase 2 se acordo que la actualizacion de producto se realizaria mediante `PATCH /products/:id` en lugar de `PUT`, para soportar cambios parciales y simplificar la evolucion del contrato.

La documentacion de API fue alineada a este criterio para la iteracion actual.

## Decision

Se adopta `PATCH /api/v1/products/:id` como endpoint oficial de actualizacion de productos para el MVP actual.

## Consecuencias

- El cliente puede enviar solo campos a modificar.
- Se reduce el acoplamiento a payloads completos.
- Se requiere una validacion adicional futura para bloquear payload vacio y reforzar semantica.

## Alternativas consideradas

- `PUT /products/:id` con reemplazo completo del recurso.
- Mantener ambos (`PUT` y `PATCH`) simultaneamente.

