# ADR-002: Eleccion de Expo + React Native para frontend

- Estado: Accepted
- Fecha: 2026-07-03

## Contexto

El MVP necesita una aplicacion movil multiplataforma, mantenible por un unico desarrollador y coherente con TypeScript.

La vision y documentacion base (`README.md`, `docs/vision.md`, `docs/architecture.md`) establecen React Native como tecnologia prevista, y el frontend actual se encuentra inicializado con Expo.

## Decision

Se adopta Expo + React Native como stack oficial de frontend para el MVP.

## Consecuencias

- Se acelera el desarrollo inicial y pruebas en entorno movil.
- Se mantiene coherencia con la arquitectura modular planteada para frontend.
- Se depende del ecosistema Expo para ciertas capacidades nativas durante el MVP.

## Alternativas consideradas

- React Native CLI sin Expo.
- Flutter.
- Aplicacion web responsiva (PWA) como primera entrega.

