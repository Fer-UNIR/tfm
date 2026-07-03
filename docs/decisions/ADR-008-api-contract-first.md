# ADR-008: API contract first before frontend development

- Estado: Accepted
- Fecha: 2026-07-03

## Contexto

Tras implementar el CRUD base de productos en Fase 2, el frontend aun no habia comenzado. Se detectaron variaciones de contrato que podian generar retrabajo en cliente:

- formato de errores no uniforme,
- regla de duplicados pendiente,
- semantica incompleta de `PATCH` con body vacio.

## Problema

Iniciar el frontend con un contrato REST inestable incrementa el riesgo de cambios frecuentes en cliente/servidor, retrabajo de integracion y pruebas menos deterministas.

## Decision

Se introduce un Sprint 2.5 dedicado exclusivamente a estabilizar el contrato publico del backend antes de iniciar el desarrollo del frontend.

Acciones incluidas:

- filtro global de excepciones con formato uniforme `error/meta`,
- manejo explicito de `400`, `404`, `409` y `500`,
- restriccion `UNIQUE(name, category)` y `409 DUPLICATE_RESOURCE`,
- rechazo de `PATCH /products/:id` con payload vacio.

## Consecuencias

- El frontend puede integrarse sobre un contrato mas estable y predecible.
- Se reduce la probabilidad de cambios de API de ultimo momento durante desarrollo de UI.
- Se invierte esfuerzo adicional temprano en robustez de contrato y pruebas e2e.

## Alternativas consideradas

- Iniciar frontend en paralelo y ajustar contrato del backend sobre la marcha.
- Estabilizar solo respuestas exitosas y dejar errores para una fase posterior.
- Diferir regla de duplicados y semantica de `PATCH` hasta Fase 3.

