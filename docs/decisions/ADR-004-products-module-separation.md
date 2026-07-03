# ADR-004: Separacion de ProductsModule respecto de InventoryModule

- Estado: Accepted
- Fecha: 2026-07-03

## Contexto

La arquitectura documentada lista modulos backend con responsabilidades separadas: `ProductsModule` para productos base e `InventoryModule` para reglas de stock y vistas derivadas.

En Fase 2 se implemento primero el backend de productos, manteniendo la nomenclatura de modulo coherente con la documentacion principal.

## Decision

Se implementa y mantiene `ProductsModule` como modulo independiente en esta iteracion, sin fusionarlo en `InventoryModule`.

## Consecuencias

- Se preserva la coherencia con la arquitectura modular planificada.
- Se facilita evolucionar `InventoryModule` despues sin acoplar CRUD base de productos.
- Se admite que, temporalmente, algunos campos de inventario (cantidad/stock minimo) aun vivan en el recurso producto hasta completar fases siguientes.

## Alternativas consideradas

- Implementar todo en un unico `InventoryModule`.
- Unificar productos e inventario en un modulo mixto para el MVP.

