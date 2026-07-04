# Registro de mejoras

Proyecto: SmartPantry-TFM  
Última actualización: 2026-07-03

---

## Objetivo

Mantener un registro de mejoras identificadas durante el desarrollo del proyecto que **no constituyen deuda técnica**, pero que podrían aumentar la calidad, mantenibilidad, rendimiento, usabilidad o robustez del sistema.

Este documento no reemplaza:

- `technical-debt.md` → decisiones técnicas postergadas deliberadamente.
- `roadmap.md` → funcionalidades futuras del producto.
- `docs/decisions/` → decisiones de arquitectura (ADR).

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

---

## Estado general

| Estado | Cantidad |
|---|---:|
| Pendiente | 5 |
| En progreso | 0 |
| Implementada | 0 |
| Descartada | 0 |

---

## Criterios de cierre

Una mejora podrá marcarse como **Implementada** únicamente cuando:

- exista evidencia en Git (commit o Pull Request);
- se hayan actualizado los tests afectados (si corresponde);
- la documentación se encuentre alineada;
- no introduzca regresiones funcionales.

Si una mejora deja de ser aplicable o se considera innecesaria, deberá marcarse como **Descartada**, indicando el motivo en la columna **Observaciones**.