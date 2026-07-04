# Roadmap del proyecto

# SmartPantry

Versión: 1.0

---

# 1. Objetivo

Este roadmap describe la evolución prevista del proyecto SmartPantry, organizando el desarrollo del MVP en fases incrementales.

Cada fase entrega una funcionalidad completa y verificable, permitiendo validar el sistema de forma progresiva y mantener una trazabilidad clara entre requisitos, implementación y pruebas.

---

# 2. Estado actual

**Fase:** Fase 4 — Lista de compras

## Completado

- Fase 1: base técnica inicial.
- Backend NestJS inicializado.
- Frontend Expo + TypeScript inicializado.
- SQLite configurado.
- Endpoint `GET /api/v1/health` operativo.
- Comunicación frontend-backend validada en dispositivo físico.
- Fase 2: backend de productos.
- CRUD backend de productos implementado.
- Contrato REST estabilizado con respuestas `data/meta` y errores `error/meta`.
- Validaciones, pruebas unitarias y e2e completadas.
- Registro de deuda técnica creado.
- Registro de mejoras creado.
- ADR iniciales creados.
- Fase 3: frontend de inventario.
- Pantalla `InventoryScreen` conectada al CRUD de `products`.
- Estados de carga, vacío y error implementados.
- Alta simple, edición de cantidad y eliminación de productos en frontend.
- Indicador visual de bajo stock implementado.
- Pruebas de componente de inventario ejecutables con React Native Testing Library.

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

## Fase 2 — Backend de productos

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

## Fase 3 — Frontend de inventario

### Objetivos

- Consumir desde móvil el backend de productos ya implementado.
- Mostrar listado y estado vacío de inventario.
- Gestionar estados de carga y error en interfaz.
- Permitir crear producto, editar cantidad y eliminar producto.
- Mostrar indicador de bajo stock en productos aplicables.
- Incorporar validación automatizada mínima de la pantalla de inventario.

### Entregables

- Pantalla móvil de inventario funcional.
- Servicio API frontend de productos.
- Tipos TypeScript de dominio/API para `Product`.
- Suite de tests de componente para `InventoryScreen`.

---

## Fase 4 — Lista de compras

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

## Fase 5 — Recetas con IA

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

## Fase 6 — Calidad

### Objetivos

- Pruebas unitarias.
- Pruebas e2e.
- Pruebas frontend.
- Validación manual.
- Corrección de incidencias.

### Entregables

- MVP estable.

---

## Fase 7 — Documentación del TFM

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
| Proyecto inicial | ✅ |
| Backend de productos funcional | ✅ |
| Frontend de inventario funcional | ✅ |
| Inventario funcional completo | ⬜ |
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