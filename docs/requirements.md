# Software Requirements Specification (SRS)

# SmartPantry

Versión: 1.0

---

# 1. Introducción

## 1.1 Propósito

Este documento define los requisitos funcionales y no funcionales del proyecto SmartPantry.

Su objetivo es servir como referencia durante el desarrollo del sistema y garantizar la trazabilidad entre los requisitos, la arquitectura, los casos de uso, la implementación y las pruebas.

---

## 1.2 Alcance

SmartPantry es una aplicación móvil para la gestión inteligente del inventario doméstico de alimentos.

El sistema permite controlar los productos disponibles, generar listas de compra y obtener recetas utilizando Inteligencia Artificial a partir del inventario existente.

Este documento describe únicamente los requisitos correspondientes al MVP desarrollado como Trabajo Fin de Máster.

---

## 1.3 Definiciones

| Término | Definición |
|----------|------------|
| Inventario | Productos actualmente disponibles en el hogar |
| Stock | Cantidad disponible de un producto |
| Stock mínimo | Cantidad mínima configurada antes de recomendar la compra |
| Lista de compras | Productos pendientes de adquirir |
| Receta IA | Receta generada mediante OpenAI utilizando el inventario disponible |

---

# 2. Stakeholders

## Usuario principal

Persona que administra los alimentos de su hogar.

## Desarrollador

Responsable de implementar el sistema.

## Tribunal del TFM

Evaluará el diseño, implementación y calidad técnica del prototipo.

---

# 3. Requisitos funcionales

## Inventario

### RF-001

Registrar un nuevo producto.

Prioridad: Alta

---

### RF-002

Editar un producto existente.

Prioridad: Alta

---

### RF-003

Eliminar un producto.

Prioridad: Alta

---

### RF-004

Actualizar la cantidad disponible de un producto.

Prioridad: Alta

---

### RF-005

Consultar el inventario.

Prioridad: Alta

---

### RF-006

Filtrar productos por categoría.

Prioridad: Media

---

### RF-007

Buscar productos.

Prioridad: Media

---

## Lista de compras

### RF-008

Crear una lista de compras.

Prioridad: Alta

---

### RF-009

Agregar productos manualmente.

Prioridad: Alta

---

### RF-010

Agregar automáticamente productos bajo stock.

Prioridad: Alta

---

### RF-011

Marcar productos como comprados.

Prioridad: Alta

---

### RF-012

Mover automáticamente productos comprados al inventario.

Prioridad: Alta

---

## Gestión de stock

### RF-013

Configurar stock mínimo por producto.

Prioridad: Alta

---

### RF-014

Detectar productos bajo stock.

Prioridad: Alta

---

## Recetas IA

### RF-015

Generar recetas utilizando únicamente productos disponibles.

Prioridad: Alta

---

### RF-016

Permitir regenerar una receta.

Prioridad: Media

---

### RF-017

Mostrar ingredientes faltantes cuando la IA los sugiera.

Prioridad: Media

---

## Persistencia

### RF-018

Guardar toda la información localmente.

Prioridad: Alta

---

### RF-019

Recuperar el inventario y la lista de compras al reiniciar la aplicación.

Prioridad: Alta

---

# 4. Requisitos no funcionales

## RNF-001

La aplicación deberá funcionar sin conexión para todas las funcionalidades excepto la generación de recetas mediante IA.

---

## RNF-002

La interfaz deberá ser intuitiva y requerir el menor número posible de acciones para realizar tareas frecuentes.

---

## RNF-003

La arquitectura deberá ser modular.

---

## RNF-004

Frontend y backend deberán permanecer desacoplados.

---

## RNF-005

La aplicación deberá utilizar TypeScript estricto.

---

## RNF-006

La API deberá exponer respuestas consistentes.

---

## RNF-007

Las claves API nunca estarán expuestas en el frontend.

---

## RNF-008

El sistema deberá permitir futuras ampliaciones sin modificar significativamente la arquitectura existente.

---

## RNF-009

El código deberá ser fácilmente mantenible y documentado.

---

## RNF-010

El sistema deberá permitir pruebas unitarias y de integración.

---

# 5. Restricciones

- React Native.
- NestJS.
- SQLite.
- OpenAI API.
- TypeScript.
- Desarrollo individual.
- Arquitectura preparada para crecimiento.

---

# 6. Supuestos

- El usuario administra un único hogar.
- Un producto pertenece a una única categoría.
- Las cantidades se gestionan mediante unidades simples.
- La IA puede generar resultados diferentes para una misma petición.

---

# 7. Criterios de aceptación generales

Se considerará completado un requisito cuando:

- esté implementado;
- compile correctamente;
- pase las pruebas correspondientes;
- esté documentado;
- pueda demostrarse durante la defensa del TFM.

---

# 8. Trazabilidad

| Requisito | Caso de uso | API | Test |
|------------|------------|-----|------|
| RF-001 | UC-001 | POST /products | ✅ |
| RF-002 | UC-002 | PATCH /products/{id} | ✅ |
| RF-003 | UC-003 | DELETE /products/{id} | ✅ |
| RF-004 | UC-004 | PATCH /inventory | ✅ |
| ... | ... | ... | ... |