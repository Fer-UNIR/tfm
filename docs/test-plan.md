# Plan de pruebas

# SmartPantry

Versión: 1.0

---

# 1. Propósito

Este documento define la estrategia de pruebas y validación del MVP de SmartPantry.

El objetivo es asegurar que las funcionalidades principales del sistema puedan verificarse de forma reproducible y que exista evidencia técnica suficiente para respaldar el desarrollo del Trabajo Fin de Máster.

---

# 2. Alcance

El plan de pruebas cubre:

- pruebas unitarias;
- pruebas de integración;
- pruebas e2e de backend;
- pruebas de componentes frontend;
- validación manual de flujos principales;
- revisión de criterios de aceptación;
- evidencia para la memoria del TFM.

---

# 3. Estrategia general

La estrategia de pruebas se organizará por funcionalidad, no solo por capa técnica.

Cada funcionalidad relevante deberá validar:

- reglas de negocio;
- contratos de API;
- comportamiento de interfaz;
- persistencia;
- manejo de errores;
- criterios de aceptación.

---

# 4. Tipos de prueba

## 4.1 Pruebas unitarias

Validan unidades pequeñas y aisladas de lógica.

Aplican principalmente a:

- servicios backend;
- reglas de negocio;
- validadores;
- mappers;
- helpers;
- lógica reutilizable del frontend.

## 4.2 Pruebas de integración

Validan la interacción entre componentes internos.

Aplican a:

- servicios y repositorios;
- capa de persistencia;
- módulos de backend;
- comunicación entre frontend y servicios API simulados.

## 4.3 Pruebas e2e backend

Validan endpoints completos desde la entrada HTTP hasta la respuesta.

Aplican a:

- creación de productos;
- consulta de inventario;
- actualización de stock;
- lista de compras;
- generación de recetas.

## 4.4 Pruebas de componentes frontend

Validan pantallas o componentes móviles.

Aplican a:

- renderizado de estados;
- acciones del usuario;
- formularios;
- mensajes de error;
- estados de carga;
- listas vacías.

## 4.5 Validación manual

Complementa las pruebas automatizadas y permite comprobar flujos reales de usuario.

Aplicará especialmente a:

- experiencia de uso;
- navegación;
- validación visual;
- generación de recetas con IA;
- capturas para la memoria del TFM.

---

# 5. Herramientas previstas

| Área | Herramienta |
|---|---|
| Backend unitario | Jest |
| Backend e2e | Jest + Supertest |
| Frontend | React Native Testing Library |
| Validación manual API | Postman, Insomnia o curl |
| Validación móvil | Expo Go o emulador |
| Cobertura | Jest coverage |

---

# 6. Comandos de validación actuales

Los siguientes comandos ya se utilizan en el repositorio y forman parte de la validación reproducible del MVP.

## Backend

```bash
npm run test
npm run test:e2e
npm run test:cov
npm run lint
npm run build
```

## Frontend

```bash
npm install
npm test
npm run typecheck
npx expo start
```

Comandos usados para cerrar Fase 3 (frontend de inventario):

```bash
cd frontend
npm run typecheck
npm run test
```

Comandos usados para validar Fase 4 (lista de compras):

```bash
cd backend
npm run test
npm run test:e2e
npm run build

cd ../frontend
npm run typecheck
npm run test
```

---

# 7. Criterios generales de aceptación

Una funcionalidad se considerará validada cuando:

- compile correctamente;
- no rompa funcionalidades existentes;
- cumpla los requisitos relacionados;
- respete las reglas de negocio;
- tenga pruebas automatizadas cuando sea viable;
- tenga validación manual documentada;
- incluya instrucciones claras para probarla;
- tenga evidencia suficiente para el TFM.

---

# 8. Plan de pruebas por funcionalidad

---

# 8.1 Inventario

## Requisitos relacionados

RF-001, RF-002, RF-003, RF-004, RF-005, RF-006, RF-007, RF-013, RF-014

Estado al cierre de Fase 4:

- Implementados y validados en código: RF-001, RF-002, RF-003, RF-004, RF-005.
- Implementados y validados para operación del MVP: RF-013 y RF-014 (stock mínimo en `products`, badge de bajo stock en inventario y sincronización de compras desde bajo stock).
- Pendientes para fases siguientes: RF-006 y RF-007 (filtro y búsqueda explícitos).

## Reglas relacionadas

RN-INV-001, RN-INV-002, RN-INV-003, RN-INV-004, RN-INV-005, RN-STK-001, RN-STK-002

## Pruebas unitarias

- Registrar producto válido.
- Rechazar producto sin nombre.
- Rechazar cantidad negativa.
- Rechazar producto duplicado.
- Actualizar cantidad válida.
- Detectar producto bajo stock.
- No marcar bajo stock si no existe stock mínimo.

## Pruebas e2e backend

- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PATCH /products/{id}`
- `DELETE /products/{id}`

Pruebas e2e planificadas para fases siguientes:

- `PATCH /inventory/products/{id}/quantity`
- `GET /inventory/low-stock`

## Pruebas frontend

- Mostrar inventario vacío.
- Mostrar lista de productos.
- Agregar producto.
- Editar cantidad de producto.
- Eliminar producto.
- Mostrar error de API.
- Mostrar productos bajo stock.
- Verificar estado de carga inicial.

## Validación manual

| Paso | Resultado esperado |
|---|---|
| Crear un producto válido | El producto aparece en el inventario |
| Crear producto con cantidad negativa | El sistema muestra error |
| Configurar stock mínimo | El sistema identifica bajo stock |
| Eliminar producto | El producto deja de aparecer |

---

# 8.2 Lista de compras

## Requisitos relacionados

RF-008, RF-009, RF-010, RF-011, RF-012

Estado al cierre de Fase 4:

- Implementados y validados en código: RF-008, RF-009, RF-010, RF-011 y RF-012.
- Cobertura automatizada:
  - pruebas unitarias de `ShoppingListService`;
  - pruebas e2e de endpoints `shopping-list`;
  - pruebas de componente de `ShoppingListScreen`.

## Reglas relacionadas

RN-SHOP-001, RN-SHOP-002, RN-SHOP-003, RN-SHOP-004, RN-SHOP-005, RN-SHOP-006, RN-SHOP-007

## Pruebas unitarias

- Agregar producto manualmente.
- Evitar duplicados.
- Actualizar cantidad si el producto ya existe.
- Rechazar cantidad menor o igual a cero.
- Marcar producto como comprado.
- Sumar cantidad comprada al inventario.

## Pruebas e2e backend

- `GET /shopping-list`
- `POST /shopping-list/items`
- `POST /shopping-list/items/from-low-stock`
- `PATCH /shopping-list/items/{id}/purchase`
- `DELETE /shopping-list/items/{id}`

## Pruebas frontend

- Navegación básica entre inventario y compras.
- Mostrar lista vacía.
- Agregar producto a la lista mediante selección de producto.
- Agregar productos bajo stock.
- Agregar producto individual desde bajo stock.
- Marcar producto como comprado.
- Marcar todos los pendientes como comprados.
- Eliminar producto de la lista.
- Mostrar errores de validación.

## Validación manual

| Paso | Resultado esperado |
|---|---|
| Agregar producto a compras | Aparece como pendiente |
| Agregar mismo producto nuevamente | Se actualiza cantidad, no se duplica |
| Marcar como comprado | Se actualiza inventario |
| Eliminar producto | Desaparece de la lista |

---

# 8.3 Recetas con IA

## Requisitos relacionados

RF-015, RF-016, RF-017

## Reglas relacionadas

RN-AI-001, RN-AI-002, RN-AI-003, RN-AI-004, RN-AI-005, RN-AI-006, RN-AI-007, RN-AI-008

## Pruebas unitarias

- Construir prompt con productos disponibles.
- Rechazar generación con inventario vacío.
- Validar respuesta normalizada.
- Manejar error del servicio de IA.
- No almacenar receta generada.

## Pruebas e2e backend

- `POST /recipes/generate`
- Respuesta exitosa con inventario válido.
- Error con inventario vacío.
- Error si falla el servicio externo.

## Pruebas frontend

- Mostrar botón de generación.
- Mostrar estado de carga.
- Mostrar receta generada.
- Mostrar ingredientes utilizados.
- Mostrar ingredientes faltantes.
- Mostrar error si no se puede generar receta.
- Permitir regenerar receta.

## Validación manual

| Paso | Resultado esperado |
|---|---|
| Generar receta con inventario disponible | Se muestra una receta |
| Generar receta sin inventario | Se muestra mensaje de error |
| Regenerar receta | Se obtiene una nueva sugerencia |
| Reiniciar aplicación | La receta anterior no queda almacenada |

---

# 8.4 Refinamiento funcional y experiencia de usuario (Fase 6)

## Requisitos no funcionales relacionados

RNF-002, RNF-009, RNF-010

## Objetivo de validación

Comprobar de forma manual y sistemática que los flujos implementados del MVP se mantienen usables, consistentes y demostrables para defensa, sin introducir nuevas funcionalidades de negocio.

## Validación manual esperada

| Flujo | Resultado esperado |
|---|---|
| Navegar inventario → compras → inventario | Navegación clara, sin pasos redundantes |
| Completar ciclo inventario → compras → receta | Flujo continuo, mensajes comprensibles y estados correctos |
| Revisar estados vacíos/carga/error en pantallas clave | Mensajes consistentes y orientados a acción |
| Revisar consistencia visual y accesibilidad básica | Componentes homogéneos, textos legibles y acciones detectables |

---

# 9. Evidencia para el TFM

Durante la validación se recopilarán:

- capturas de pantalla del frontend;
- salida de pruebas automatizadas;
- capturas de Postman, Insomnia o terminal;
- tabla de requisitos validados;
- errores detectados y corregidos;
- limitaciones conocidas.

Evidencia esperada para cierre de Fase 3:

- salida de `npm run typecheck` sin errores;
- salida de `npm run test` en frontend con pruebas de `InventoryScreen` en verde;
- evidencia visual de estados clave de inventario:
  - carga;
  - vacío;
  - listado con badge de bajo stock;
  - error de API.

Evidencia añadida en Fase 4:

- salida de `npm run test` y `npm run test:e2e` en backend con pruebas de lista de compras en verde;
- salida de `npm run typecheck` y `npm run test` en frontend con `ShoppingListScreen` en verde;
- validación funcional de:
  - navegar entre inventario y compras;
  - agregar manualmente productos desde selección;
  - sincronizar desde bajo stock;
  - agregar producto individual desde bajo stock;
  - marcar producto como comprado y actualizar inventario;
  - marcar todos los pendientes como comprados;
  - eliminar producto de lista.

---

# 10. Matriz de trazabilidad

| Funcionalidad | Requisitos | Reglas | Pruebas |
|---|---|---|---|
| Inventario | RF-001 a RF-007, RF-013, RF-014 | RN-INV, RN-STK | Unitarias, e2e, frontend, manual |
| Lista de compras | RF-008 a RF-012 | RN-SHOP | Unitarias, e2e, frontend, manual |
| Recetas IA | RF-015 a RF-017 | RN-AI | Unitarias, e2e, frontend, manual |
| Persistencia | RF-018, RF-019 | RN-DATA | Integración, manual |

---

# 11. Riesgos de prueba

| Riesgo | Mitigación |
|---|---|
| Respuestas variables de IA | Mockear OpenAI en pruebas automatizadas y validar manualmente casos reales. |
| Falta de tiempo | Priorizar pruebas de reglas de negocio y flujos críticos. |
| Cambios en contratos API | Mantener `docs/api-design.md` actualizado. |
| Dificultad de pruebas móviles | Complementar con validación manual documentada. |
| Persistencia local inconsistente | Usar datos de prueba controlados y reset de base cuando sea necesario. |

---

# 12. Estado del plan

Estado actual de validación por fase:

- Fase 1 (base técnica): validada.
- Fase 2 (backend de productos): validada con unitarias y e2e.
- Fase 3 (frontend de inventario): **validable y ejecutable** con:
  - pruebas de componente de `InventoryScreen`;
  - `npm run typecheck` en frontend.
- Fase 4 (lista de compras): **validada** con unitarias, e2e y pruebas de componente.
- Fase 5 (recetas con IA): pendiente de implementación y validación.
- Fase 6 (refinamiento funcional y experiencia de usuario): planificada para consolidar UX del MVP mediante validación manual y mejoras de interacción, sin ampliar reglas de negocio.
- Fase 7 (calidad): planificada tras el refinamiento funcional para estabilización integral.
- Fase 8 (documentación del TFM): planificada para cierre académico y evidencia final.