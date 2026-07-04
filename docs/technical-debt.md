# Registro de deuda tecnica

Proyecto: SmartPantry-TFM  
Ultima actualizacion: 2026-07-04

## Objetivo

Mantener un registro formal, trazable y priorizado de la deuda tecnica detectada durante el desarrollo del MVP, para planificar su resolucion por fases sin perder estabilidad del proyecto.

## Formato de entradas

Cada entrada debe incluir:

- ID
- Fecha
- Modulo
- Descripcion
- Motivo por el que no se implemento ahora
- Impacto
- Prioridad (Alta / Media / Baja)
- Fase prevista para resolverlo
- Estado (Pendiente / En progreso / Resuelto)

## Entradas registradas

| ID | Fecha | Modulo | Descripcion | Motivo por el que no se implemento ahora | Impacto | Prioridad | Fase prevista para resolverlo | Estado |
|---|---|---|---|---|---|---|---|---|
| TD-001 | 2026-07-03 | Backend API (global) | El formato de error real de NestJS no seguia el contrato uniforme `error/meta` definido en `docs/api-design.md` (resuelto en Sprint 2.5). | En Fase 1 y 2 se priorizo habilitar endpoints base y validaciones con `ValidationPipe`. No se implemento aun un filtro global de excepciones con contrato estandarizado. | Inconsistencia de contrato para frontend y pruebas; mayor esfuerzo de manejo de errores cliente. | Alta | Fase 3 | Resuelto |
| TD-002 | 2026-07-03 | ProductsModule | No se aplicaba la regla RN-INV-002 de evitar productos duplicados por `name + category` (resuelto en Sprint 2.5). | Se priorizo CRUD base y validaciones estructurales de entrada para cerrar iteracion de inventario backend. | Riesgo de datos duplicados y comportamiento ambiguo en inventario/lista de compras futura. | Alta | Fase 3 | Resuelto |
| TD-003 | 2026-07-03 | ProductsModule | `PATCH /products/:id` aceptaba payload vacio y actualizaba solo `updatedAt` (resuelto en Sprint 2.5). | Se implemento actualizacion parcial minima sin validador de "al menos un campo de negocio". | Semantica HTTP confusa y escrituras innecesarias en base de datos. | Media | Fase 3 | Resuelto |
| TD-004 | 2026-07-03 | ProductsModule / modelo de datos | `category` se maneja como string libre en el MVP, sin catalogo normalizado de categorias. | Decision explicita de simplicidad para iteracion inicial del modulo de productos. | Riesgo de categorias inconsistentes (errores tipograficos, variantes) y dificultad para filtros/reportes. | Media | Fase 4 | Pendiente |
| TD-005 | 2026-07-03 | Persistencia SQLite | No existe estrategia formal de migraciones/versionado de esquema; las tablas se crean directamente en runtime. | En Fase 1/2 se priorizo rapidez del prototipo con SQLite sin ORM. | Riesgo de cambios manuales y mayor complejidad al evolucionar esquema en fases futuras. | Alta | Fase 4 | Pendiente |
| TD-006 | 2026-07-03 | ProductsModule | Faltaba cobertura de casos clave en tests (not found en PATCH/DELETE e2e, PATCH vacio, contrato de error uniforme) y se amplio en Sprint 2.5. | Cobertura inicial enfocada en flujo CRUD principal y validaciones basicas para mantener ciclo corto de entrega. | Menor deteccion temprana de regresiones en contratos de error y reglas de actualizacion. | Media | Fase 3 | Resuelto |
| TD-007 | 2026-07-03 | ProductsModule / API | No hay paginacion ni filtros de listado (`GET /products`) para crecimiento de datos. | Fuera del alcance de CRUD basico de Fase 2; se priorizo simplicidad. | Degradacion de rendimiento y UX cuando crezca el inventario. | Baja | Fase 4 | Pendiente |
| TD-008 | 2026-07-03 | Dependencias backend | Existen vulnerabilidades reportadas por npm audit en dependencias del backend. | Se evito actualizar con cambios potencialmente disruptivos durante cierre funcional de Fase 2. | Riesgo de seguridad/actualizacion y deuda operativa en mantenimiento. | Media | Fase 4 | Pendiente |
| TD-009 | 2026-07-03 | Documentacion API | Desalineacion heredada en Health: el endpoint devuelve `database` pero el ejemplo en `docs/api-design.md` no lo reflejaba completo (resuelto en Sprint 2.5). | Se priorizo actualizar trazabilidad de productos en esta iteracion. | Documentacion parcialmente inconsistente y posible confusion en consumo del endpoint de salud. | Baja | Fase 3 | Resuelto |
| TD-010 | 2026-07-04 | RecipesModule / OpenAiRecipeService | La integracion con OpenAI no implementa politicas de resiliencia (timeout explicito, reintentos con backoff, circuit breaker). | En cierre funcional de Fase 5 se priorizo entregar generacion real de recetas con contrato estructurado y manejo de errores uniforme. | Riesgo de fallos transitorios sin recuperacion automatica y mayor sensibilidad a latencia del proveedor IA. | Alta | Fase 7 | Pendiente |
| TD-011 | 2026-07-04 | Observabilidad IA | No existe trazabilidad operativa de consumo IA (tokens, costo por solicitud, latencia por llamada, ratio de error por modelo). | Fuera del alcance del cierre funcional de Fase 5 y sin requerimiento de monitoreo avanzado para el MVP inicial. | Dificulta control de costos, diagnostico de incidencias y evaluacion cuantitativa del comportamiento del modulo de recetas IA. | Media | Fase 7 | Pendiente |
| TD-012 | 2026-07-04 | Configuracion backend | `backend/.env.example` no incluye placeholders para `OPENAI_API_KEY` y `OPENAI_MODEL`. | Se mantuvo el archivo minimo historico durante iteraciones funcionales para evitar mezclar cambios de configuracion con desarrollo de endpoints. | Riesgo de friccion en onboarding y configuracion incompleta del entorno de desarrollo para recetas IA. | Baja | Fase 6 | Pendiente |

