# ADR-003: Uso de SQLite sin ORM durante el MVP

- Estado: Accepted
- Fecha: 2026-07-03

## Contexto

El MVP requiere persistencia local simple, con bajo costo de complejidad y control explicito del acceso a datos.

La arquitectura del proyecto define SQLite como tecnologia inicial y una capa de persistencia desacoplada del controlador HTTP.

## Decision

Se utiliza SQLite con acceso directo mediante SQL (sin ORM) durante el MVP, encapsulado en la capa de persistencia/repositorio.

## Consecuencias

- Se reduce complejidad inicial y dependencia de herramientas ORM.
- Se mantiene control fino sobre el SQL y el esquema.
- Se asume deuda tecnica de migraciones/versionado de esquema para fases posteriores.

## Alternativas consideradas

- TypeORM con SQLite.
- Prisma con SQLite.
- Drizzle ORM.

