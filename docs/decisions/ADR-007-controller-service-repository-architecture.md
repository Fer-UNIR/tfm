# ADR-007: Arquitectura Controller -> Service -> Repository

- Estado: Accepted
- Fecha: 2026-07-03

## Contexto

El proyecto exige separacion clara de responsabilidades en backend NestJS, siguiendo reglas de arquitectura del repositorio y buenas practicas de mantenibilidad para TFM.

En Fase 2, `ProductsModule` se implemento con controlador HTTP, servicio de aplicacion y repositorio de persistencia SQLite, reutilizando `PersistenceService`.

## Decision

Se adopta y mantiene el patron `Controller -> Service -> Repository` como estructura base para modulos de dominio backend.

## Consecuencias

- Mayor claridad de capas y testabilidad.
- Menor acoplamiento entre transporte HTTP y SQL.
- Requiere disciplina para evitar que validaciones/reglas se dispersen entre capas.

## Alternativas consideradas

- Controller -> Service (sin repositorio dedicado, SQL en servicio).
- Controller -> Repository directo (sin capa de servicio).
- Arquitectura mas compleja con capa adicional de casos de uso desde esta fase.

