# ADR-006: Uso de category como string durante el MVP

- Estado: Accepted
- Fecha: 2026-07-03

## Contexto

En la implementacion de Fase 2 se priorizo un CRUD basico de productos y simplicidad de datos.

Se decidio no introducir aun entidad/tabla de categorias ni `categoryId/categoryName`, usando `category` como campo string para acelerar entrega y mantener bajo acoplamiento inicial.

## Decision

Se modela `category` como string en el recurso producto durante el MVP inicial.

## Consecuencias

- Menor complejidad de implementacion y API en Fase 2.
- Riesgo de inconsistencia de valores de categoria.
- Queda pendiente una posible normalizacion futura (catalogo de categorias) segun necesidades de filtros y reporting.

## Alternativas consideradas

- Tabla de categorias con `categoryId` y relacion en productos.
- Catalogo cerrado hardcodeado con validacion por enum.

