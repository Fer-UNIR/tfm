# ADR-009: Ciclo de vida de items de compra al confirmar una compra

- Estado: Accepted
- Fecha: 2026-07-04

## Contexto

En Fase 4 se implemento `PATCH /shopping-list/items/:id/purchase` con el requisito de mover la cantidad comprada al inventario (`RF-012`) y evitar duplicados en lista activa (`RN-SHOP-004`).

El contrato de `docs/api-design.md` contemplaba dos alternativas para el item comprado:

- marcarlo como `purchased`, o
- eliminarlo de la lista activa.

## Decision

Se adopta un enfoque combinado:

- al confirmar compra, el registro se marca como `purchased` en persistencia;
- `GET /shopping-list` devuelve solo items `pending`, por lo que el item comprado desaparece de la lista activa del usuario.

## Consecuencias

- Se cumple el flujo funcional esperado por el usuario (el item ya no aparece en pendientes).
- Se conserva trazabilidad interna del evento de compra sin requerir endpoint adicional de historial en el MVP.
- Se mantiene simple el contrato actual del frontend, que trabaja solo con lista activa.

## Alternativas consideradas

- Eliminar fisicamente el item comprado en `PATCH /purchase`.
- Mantener items `purchased` visibles en el mismo `GET /shopping-list`.
