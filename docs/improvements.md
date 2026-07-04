# Registro de mejoras

Proyecto: SmartPantry-TFM  
Última actualización: 2026-07-04

---

## Objetivo

Mantener un registro de mejoras identificadas durante el desarrollo del proyecto que **no constituyen deuda técnica**, pero que podrían aumentar la calidad, mantenibilidad, rendimiento, usabilidad o robustez del sistema.

Este documento no reemplaza:

- `technical-debt.md` → decisiones técnicas postergadas deliberadamente.
- `roadmap.md` → funcionalidades futuras del producto.
- `docs/decisions/` → decisiones de arquitectura (ADR).

Relación con roadmap:

- durante la **Fase 6 — Refinamiento funcional y experiencia de usuario**, este registro actúa como artefacto principal para justificar mejoras de interacción, consistencia visual y usabilidad del MVP.

---

## Cuándo registrar una mejora

Registrar aquí únicamente mejoras que:

- no corrigen un defecto funcional;
- no corrigen un incumplimiento del contrato de la API;
- no fueron deliberadamente postergadas como deuda técnica;
- representan una optimización, refactorización o mejora de calidad.

---

## Formato de las entradas

Cada mejora debe incluir:

- ID
- Fecha
- Módulo
- Descripción
- Beneficio esperado
- Prioridad (Alta / Media / Baja)
- Estado (Pendiente / En progreso / Implementada / Descartada)
- Observaciones

---

## Entradas registradas

| ID | Fecha | Módulo | Descripción | Beneficio esperado | Prioridad | Estado | Observaciones |
|---|---|---|---|---|---|---|---|
| FI-001 | 2026-07-03 | Products API | Validar que los IDs de rutas sean mayores que cero y responder `400 Bad Request` en lugar de `404 Not Found` cuando el valor sea inválido. | Contrato HTTP más preciso y validaciones más robustas. | Baja | Pendiente | No afecta el funcionamiento actual del MVP. |
| FI-002 | 2026-07-03 | Products API | Evaluar que la restricción de unicidad `name + category` sea insensible a mayúsculas y minúsculas (`Arroz` = `arroz`). | Evitar duplicados semánticos y mejorar la consistencia del inventario. | Baja | Pendiente | Requiere definir regla de negocio antes de implementarlo. |
| FI-003 | 2026-07-04 | Frontend Inventario | Solicitar confirmación antes de eliminar un producto para evitar eliminaciones accidentales. | Mejor experiencia de usuario y menor riesgo de errores. | Media | Pendiente | Puede implementarse mediante un diálogo de confirmación nativo. |
| FI-004 | 2026-07-04 | Frontend Inventario | Sustituir `SafeAreaView` de React Native por `react-native-safe-area-context` para eliminar el warning de deprecación y alinearse con las recomendaciones actuales. | Mejor mantenibilidad y compatibilidad con versiones futuras de React Native. | Baja | Pendiente | No afecta el funcionamiento actual del MVP. |
| FI-005 | 2026-07-04 | Frontend Inventario | Ordenar automáticamente el listado de productos por nombre antes de mostrarlo. | Facilita localizar productos en inventarios grandes. | Baja | Pendiente | El ordenamiento puede realizarse en frontend sin modificar el contrato de la API. |
| FI-006 | 2026-07-04 | Frontend Fase 4 | Mejorar usabilidad de compras para demo TFM: navegación inventario/compras, alta manual por selección, agregado individual de bajo stock y compra masiva de pendientes. | Flujo demostrable de extremo a extremo con menos fricción en la interacción manual. | Alta | Implementada | Validada con pruebas de componente y `typecheck` en frontend. |
| FI-007 | 2026-07-04 | Frontend Inventario | Permitir editar el stock mínimo de un producto ya existente sin necesidad de eliminarlo y crearlo nuevamente. | Mayor flexibilidad para administrar alertas de bajo stock y mejor experiencia de usuario. | Media | Pendiente | Evaluar incorporar acción "Editar" o edición directa desde la tarjeta del producto durante la Fase 6 de refinamiento UX. |
| FI-008 | 2026-07-04 | Frontend Compras | Revisar el comportamiento de la sección "Productos con bajo stock" cuando un producto ya fue agregado a la lista de compras. Evaluar mantenerlo visible con indicador de "Ya agregado" o deshabilitar la acción de agregar nuevamente. | Reducir confusión y evitar acciones duplicadas manteniendo la representación correcta del estado del inventario. | Media | Pendiente | Decisión de experiencia de usuario a validar mediante pruebas manuales durante la Fase 6. |
| FI-009 | 2026-07-04 | Frontend Compras | Permitir modificar la cantidad de un producto directamente desde la lista de compras mediante acciones rápidas (+1 / -1), sin eliminar y volver a agregar el elemento. | Reduce pasos para el usuario y mejora la eficiencia al preparar la lista de compras. | Alta | Pendiente | Mantener sincronización con las reglas de negocio existentes y actualizar la cantidad pendiente en tiempo real. |
| FI-010 | 2026-07-04 | Frontend Persistencia | Incorporar persistencia local en el dispositivo para permitir consultar y gestionar inventario y lista de compras sin conexión a Internet, sincronizando posteriormente con el backend cuando exista conectividad. | Cumple completamente el RNF-001 y mejora la experiencia de uso en escenarios con conectividad limitada, como durante las compras en un supermercado. | Alta | Pendiente | Evaluar `expo-sqlite` como almacenamiento local y definir estrategia de sincronización con la API del backend. |

---

## Estado general

| Estado | Cantidad |
|---|---:|
| Pendiente | 8 |
| En progreso | 0 |
| Implementada | 1 |
| Descartada | 0 |

---

## Criterios de cierre

Una mejora podrá marcarse como **Implementada** únicamente cuando:

- exista evidencia en Git (commit o Pull Request);
- se hayan actualizado los tests afectados (si corresponde);
- la documentación se encuentre alineada;
- no introduzca regresiones funcionales.

Si una mejora deja de ser aplicable o se considera innecesaria, deberá marcarse como **Descartada**, indicando el motivo en la columna **Observaciones**.