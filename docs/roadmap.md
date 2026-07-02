# Roadmap del proyecto

# SmartPantry

Versión: 1.0

---

# 1. Objetivo

Este roadmap describe la evolución prevista del proyecto SmartPantry, organizando el desarrollo del MVP en fases incrementales.

Cada fase entrega una funcionalidad completa y verificable, permitiendo validar el sistema de forma progresiva y mantener una trazabilidad clara entre requisitos, implementación y pruebas.

---

# 2. Estado actual

**Fase:** Planificación

## Completado

- Definición de la visión del producto.
- Identificación de requisitos.
- Definición de reglas de negocio.
- Casos de uso.
- Diseño de arquitectura.
- Diseño preliminar de la API.
- Configuración inicial del proyecto.
- Configuración de Cursor (Rules y Skills).

---

# 3. Roadmap

## Fase 1 — Base del proyecto

### Objetivos

- Crear la estructura del proyecto.
- Configurar frontend y backend.
- Configurar SQLite.
- Configurar herramientas de desarrollo.
- Configurar calidad de código.

### Entregables

- Proyecto compilando.
- Arquitectura base.
- Comunicación frontend-backend.
- Persistencia funcionando.

---

## Fase 2 — Gestión de inventario

### Objetivos

- Crear categorías.
- Registrar productos.
- Editar productos.
- Eliminar productos.
- Consultar inventario.
- Buscar productos.
- Filtrar por categoría.
- Actualizar cantidades.
- Configurar stock mínimo.

### Entregables

- Inventario completamente funcional.

---

## Fase 3 — Lista de compras

### Objetivos

- Crear lista de compras.
- Agregar productos manualmente.
- Agregar productos bajo stock.
- Evitar duplicados.
- Marcar productos como comprados.
- Actualizar inventario automáticamente.

### Entregables

- Gestión completa de compras.

---

## Fase 4 — Recetas con IA

### Objetivos

- Integrar OpenAI API.
- Construir prompts.
- Generar recetas.
- Mostrar ingredientes utilizados.
- Mostrar ingredientes faltantes.
- Gestionar errores del servicio.

### Entregables

- Generación funcional de recetas.

---

## Fase 5 — Calidad

### Objetivos

- Pruebas unitarias.
- Pruebas e2e.
- Pruebas frontend.
- Validación manual.
- Corrección de incidencias.

### Entregables

- MVP estable.

---

## Fase 6 — Documentación del TFM

### Objetivos

- Actualizar documentación técnica.
- Capturas del sistema.
- Diagramas.
- Evidencias.
- Preparar memoria.
- Preparar defensa.

### Entregables

- Documentación completa.
- Evidencias de funcionamiento.
- Material para la defensa.

---

# 4. Hitos principales

| Hito | Estado |
|-------|--------|
| Arquitectura aprobada | ✅ |
| Proyecto inicial | ⬜ |
| Inventario funcional | ⬜ |
| Lista de compras funcional | ⬜ |
| Recetas IA funcionando | ⬜ |
| Pruebas completadas | ⬜ |
| MVP finalizado | ⬜ |
| Memoria finalizada | ⬜ |

---

# 5. Riesgos

| Riesgo | Mitigación |
|---------|------------|
| Cambios de alcance | Mantener el foco en el MVP. |
| Integración con OpenAI | Diseñar una capa de abstracción y manejar errores correctamente. |
| Retrasos | Desarrollar por funcionalidades completas e incrementales. |
| Complejidad innecesaria | Priorizar soluciones simples y mantenibles. |

---

# 6. Trabajo posterior al MVP

Posibles líneas de evolución:

- autenticación de usuarios;
- sincronización en la nube;
- múltiples hogares;
- colaboración entre usuarios;
- historial de recetas;
- recetas favoritas;
- escaneo de códigos de barras;
- reconocimiento de productos mediante cámara;
- integración con supermercados;
- planificación semanal de comidas;
- análisis del desperdicio alimentario;
- recomendaciones personalizadas mediante IA.