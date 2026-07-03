# ADR-001: Eleccion de NestJS como framework backend

- Estado: Accepted
- Fecha: 2026-07-03

## Contexto

El proyecto SmartPantry-TFM requiere un backend modular, tipado en TypeScript, con soporte para desarrollo incremental de un MVP y facilidad para pruebas unitarias y e2e.

La arquitectura definida en `docs/architecture.md` y la base del repositorio ya usan NestJS para los modulos iniciales (`HealthModule`, `PersistenceModule`).

## Decision

Se adopta NestJS como framework backend oficial del proyecto durante el MVP.

## Consecuencias

- Se favorece una estructura modular (Module/Controller/Service) coherente con el TFM.
- Se simplifica el uso de inyeccion de dependencias y pruebas.
- Se asume el costo de curva de aprendizaje y convenciones de NestJS.

## Alternativas consideradas

- Express + TypeScript sin framework estructurado.
- Fastify + TypeScript con arquitectura manual.
- Koa + TypeScript.

