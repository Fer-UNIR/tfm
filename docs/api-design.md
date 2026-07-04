# Diseño de API

# SmartPantry

Versión: 1.0

---

# 1. Propósito

Este documento define el diseño inicial de la API de SmartPantry.

La API actúa como contrato entre la aplicación móvil y el backend, estableciendo recursos, endpoints, estructuras de datos, validaciones, respuestas y manejo de errores para el MVP.

---

# 2. Principios generales

La API seguirá los siguientes principios:

- estilo REST;
- contratos simples y explícitos;
- respuestas JSON;
- uso de DTOs tipados;
- validaciones en backend;
- errores consistentes;
- separación entre contratos públicos y modelo interno de persistencia;
- no exposición de claves privadas;
- versionado preparado para evolución futura.

---

# 3. URL base

Durante el desarrollo local:

```text
http://localhost:3000/api/v1
```

En entorno móvil físico, la URL podrá variar según la red local o configuración de Expo.

---

# 4. Versionado

La primera versión de la API utilizará el prefijo:

```text
/api/v1
```

Esto permitirá introducir cambios futuros sin romper contratos existentes.

---

# 5. Formato general de respuesta

## 5.1 Respuesta exitosa

```json
{
  "data": {},
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

## 5.2 Respuesta con lista

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

## 5.3 Respuesta de error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos.",
    "details": []
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

### Notas de contrato de error

- Todas las respuestas de error del backend usan el mismo formato `error/meta`.
- `details` se utiliza para incluir lista de errores de validación o pistas de conflicto.
- Códigos estabilizados para esta fase: `VALIDATION_ERROR`, `NOT_FOUND`, `DUPLICATE_RESOURCE`, `BUSINESS_RULE_ERROR`, `AI_SERVICE_ERROR`, `INTERNAL_ERROR`.

---

# 6. Códigos de error

| Código | Descripción |
|---|---|
| VALIDATION_ERROR | La solicitud contiene datos inválidos. |
| NOT_FOUND | El recurso solicitado no existe. |
| DUPLICATE_RESOURCE | Ya existe un recurso equivalente. |
| BUSINESS_RULE_ERROR | La operación incumple una regla de negocio. |
| AI_SERVICE_ERROR | Error al comunicarse con el servicio de IA. |
| INTERNAL_ERROR | Error inesperado del servidor. |

---

# 7. Autenticación

La autenticación queda fuera del alcance del MVP.

Sin embargo:

- la arquitectura debe permitir agregar autenticación en futuras versiones;
- las claves de OpenAI no deben exponerse al frontend;
- cualquier integración con IA debe ejecutarse desde backend.

---

# 8. Recursos principales

## 8.1 Producto

Representa un alimento registrado por el usuario.

```json
{
  "id": 1,
  "name": "Arroz",
  "category": "Despensa",
  "quantity": 1,
  "unit": "kg",
  "minimumStock": 1,
  "createdAt": "2026-01-01T12:00:00.000Z",
  "updatedAt": "2026-01-01T12:00:00.000Z"
}
```

---

## 8.2 Categoría

```json
{
  "id": "uuid",
  "name": "Despensa"
}
```

---

## 8.3 Elemento de lista de compras

```json
{
  "id": 1,
  "productId": 1,
  "productName": "Arroz",
  "quantity": 1,
  "unit": "kg",
  "status": "pending",
  "createdAt": "2026-01-01T12:00:00.000Z"
}
```

Estados permitidos:

```text
pending
purchased
```

---

## 8.4 Receta generada

Las recetas generadas no se almacenan en el MVP.

La respuesta de generación de receta será efímera y dependerá del inventario disponible en el momento de la solicitud.

```json
{
  "title": "Arroz salteado con verduras",
  "mealType": "almuerzo",
  "servings": 2,
  "preparationTimeMinutes": 30,
  "ingredientsUsed": [
    {
      "name": "Arroz",
      "quantity": "1 taza"
    },
    {
      "name": "Zanahoria",
      "quantity": "1 unidad"
    }
  ],
  "optionalIngredients": [
    "Queso rallado",
    "Limon"
  ],
  "missingIngredients": [
    "Salsa de soja"
  ],
  "steps": [
    "Preparar ingredientes.",
    "Cocer el arroz.",
    "Saltear las verduras.",
    "Mezclar y servir."
  ],
  "notes": "Receta sugerida por IA a partir del inventario disponible."
}
```

Regla de contrato para recetas IA:

- `steps` debe contener entre `4` y `8` elementos.

---

# 9. Endpoints

Estado de implementación al cierre de Fase 5:

- Implementados en backend: `GET /health`, CRUD de `products`, endpoints de `shopping-list` y `POST /recipes/generate` con integración OpenAI.
- RF-014 (detección de bajo stock) se cubre en Fase 4 mediante lógica sobre `products` y el endpoint `POST /shopping-list/items/from-low-stock`.
- Planificados para fases posteriores: categorías y endpoints específicos de inventario.

# 9.1 Health (Implementado)

## GET `/health`

Permite verificar que el backend está disponible.

### Respuesta 200

```json
{
  "data": {
    "status": "ok",
    "database": "up"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

# 9.2 Productos (Implementado)

## GET `/products`

Obtiene todos los productos registrados.

### Respuesta 200

```json
{
  "data": [
    {
      "id": 1,
      "name": "Arroz",
      "category": "Despensa",
      "quantity": 1,
      "unit": "kg",
      "minimumStock": 1,
      "createdAt": "2026-01-01T12:00:00.000Z",
      "updatedAt": "2026-01-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## GET `/products/{id}`

Obtiene un producto por identificador.

### Respuesta 200

```json
{
  "data": {
    "id": 1,
    "name": "Arroz",
    "category": "Despensa",
    "quantity": 1,
    "unit": "kg",
    "minimumStock": 1,
    "createdAt": "2026-01-01T12:00:00.000Z",
    "updatedAt": "2026-01-01T12:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## POST `/products`

Registra un nuevo producto.

### Request

```json
{
  "name": "Arroz",
  "category": "Despensa",
  "quantity": 1,
  "unit": "kg",
  "minimumStock": 1
}
```

### Validaciones

- `name` obligatorio.
- `category` obligatorio.
- `quantity` debe ser mayor o igual a 0.
- `unit` obligatorio.
- `minimumStock` opcional, pero si existe debe ser mayor o igual a 0.
- no debe existir otro producto con el mismo nombre y categoría.

### Errores relevantes

- `400 VALIDATION_ERROR` cuando el payload no cumple DTO.
- `409 DUPLICATE_RESOURCE` cuando ya existe un producto con el mismo `name` y `category`.

### Respuesta 201

```json
{
  "data": {
    "id": 1,
    "name": "Arroz",
    "category": "Despensa",
    "quantity": 1,
    "unit": "kg",
    "minimumStock": 1,
    "createdAt": "2026-01-01T12:00:00.000Z",
    "updatedAt": "2026-01-01T12:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## PATCH `/products/{id}`

Actualiza un producto existente.

### Request

```json
{
  "name": "Arroz integral",
  "category": "Despensa",
  "quantity": 2,
  "unit": "kg",
  "minimumStock": 1
}
```

### Reglas

- Debe enviarse al menos un campo de actualización.
- Si el body llega vacío (`{}`), la API responde `400 VALIDATION_ERROR`.

### Errores relevantes

- `400 VALIDATION_ERROR` para payload inválido o vacío.
- `404 NOT_FOUND` si el producto no existe.
- `409 DUPLICATE_RESOURCE` si la actualización provoca duplicado por `name + category`.

### Respuesta 200

```json
{
  "data": {
    "id": 1,
    "name": "Arroz integral",
    "category": "Despensa",
    "quantity": 2,
    "unit": "kg",
    "minimumStock": 1,
    "createdAt": "2026-01-01T12:00:00.000Z",
    "updatedAt": "2026-01-02T12:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-02T12:00:00.000Z"
  }
}
```

---

## DELETE `/products/{id}`

Elimina un producto.

### Respuesta 204

Sin contenido.

---

# 9.3 Categorías (Planificado)

> Estos endpoints se mantienen como contrato objetivo y todavía no están implementados en backend al cierre de Fase 4.

## GET `/categories`

Obtiene las categorías disponibles.

### Respuesta 200

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Despensa"
    },
    {
      "id": "uuid",
      "name": "Refrigerados"
    },
    {
      "id": "uuid",
      "name": "Congelados"
    }
  ],
  "meta": {
    "total": 3,
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## POST `/categories`

Crea una categoría.

### Request

```json
{
  "name": "Verduras"
}
```

### Respuesta 201

```json
{
  "data": {
    "id": "uuid",
    "name": "Verduras"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

# 9.4 Lista de compras (Implementado)

> Estos endpoints están implementados en backend al cierre de Fase 4.

## GET `/shopping-list`

Obtiene los productos pendientes de compra.

### Respuesta 200

```json
{
  "data": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Arroz",
      "quantity": 1,
      "unit": "kg",
      "status": "pending",
      "createdAt": "2026-01-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## POST `/shopping-list/items`

Agrega un producto a la lista de compras.

### Request

```json
{
  "productId": 1,
  "quantity": 1,
  "unit": "kg"
}
```

### Reglas

- La cantidad debe ser mayor que 0.
- Si el producto ya existe en la lista activa, se actualiza la cantidad.
- No se deben crear duplicados.

### Errores relevantes

- `400 VALIDATION_ERROR` cuando `productId` o `quantity` no son válidos.
- `404 NOT_FOUND` cuando el producto no existe en inventario.

### Respuesta 201

```json
{
  "data": {
    "id": 1,
    "productId": 1,
    "productName": "Arroz",
    "quantity": 1,
    "unit": "kg",
    "status": "pending",
    "createdAt": "2026-01-01T12:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## POST `/shopping-list/items/from-low-stock`

Agrega automáticamente productos bajo stock a la lista de compras.

### Respuesta 200

```json
{
  "data": {
    "addedItems": 3,
    "updatedItems": 1
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## PATCH `/shopping-list/items/{id}/purchase`

Marca un producto como comprado y actualiza el inventario.

### Request

```json
{
  "purchasedQuantity": 2
}
```

### Reglas

- `purchasedQuantity` debe ser mayor que 0.
- Al confirmar la compra, la cantidad comprada se suma al inventario.
- El elemento queda marcado como comprado y deja de aparecer en la lista activa (`GET /shopping-list` solo devuelve `pending`).

### Errores relevantes

- `400 VALIDATION_ERROR` cuando `purchasedQuantity` no es válido.
- `404 NOT_FOUND` cuando el item de compra no existe o el producto asociado no está disponible.

### Respuesta 200

```json
{
  "data": {
    "shoppingItemId": 1,
    "productId": 1,
    "newInventoryQuantity": 3
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## DELETE `/shopping-list/items/{id}`

Elimina un producto de la lista de compras.

### Respuesta 204

Sin contenido.

---

# 9.5 Inventario (Planificado)

> Estos endpoints se mantienen como contrato objetivo y todavía no están implementados en backend al cierre de Fase 4.

## GET `/inventory/low-stock`

Obtiene productos bajo stock.

### Respuesta 200

```json
{
  "data": [
    {
      "id": 1,
      "name": "Arroz",
      "quantity": 1,
      "unit": "kg",
      "minimumStock": 1,
      "category": "Despensa"
    }
  ],
  "meta": {
    "total": 1,
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

## PATCH `/inventory/products/{id}/quantity`

Actualiza la cantidad disponible de un producto.

### Request

```json
{
  "quantity": 2
}
```

### Reglas

- La cantidad debe ser mayor o igual a 0.

### Respuesta 200

```json
{
  "data": {
    "id": "uuid",
    "name": "Arroz",
    "quantity": 2,
    "unit": "kg",
    "minimumStock": 1
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

# 9.6 Recetas IA (Implementado con OpenAI)

> Endpoint implementado en backend con inventario real y generación de receta vía OpenAI.

## POST `/recipes/generate`

Genera una receta a partir del inventario disponible.

Las recetas no se almacenan en el MVP.

### Request

```json
{
  "preferences": {
    "mealType": "almuerzo",
    "maxPreparationMinutes": 30,
    "servings": 2,
    "dietaryRestrictions": []
  }
}
```

### Reglas

- El backend consulta inventario real (`products`) y filtra productos con `quantity > 0`.
- Si no hay productos disponibles, la API responde `400 BUSINESS_RULE_ERROR`.
- `mealType` es opcional y permite: `desayuno`, `almuerzo`, `cena`, `colacion`, `cualquiera`.
- `servings` es opcional y debe estar entre `1` y `6`.
- `maxPreparationMinutes` es opcional y debe estar entre `5` y `180`.
- `dietaryRestrictions` es opcional y debe ser un array de strings.
- RF-016 se cubre invocando nuevamente `POST /recipes/generate` con las mismas o nuevas preferencias.
- Se construye internamente una estructura `inventoryForPrompt` con `name`, `quantity` y `unit`.
- Se construye un prompt dinámico con inventario y preferencias normalizadas.
- La generación se realiza con `RECIPE_SYSTEM_PROMPT` + prompt de usuario dinámico.
- `steps` debe contener entre `4` y `8` elementos.
- El esquema `json_schema` restringe `steps` con `minItems: 4` y `maxItems: 8`.
- Como defensa adicional para el MVP, si la IA devuelve más de `8` pasos, el backend trunca a `8`.
- Errores de OpenAI o parseo se mapean a `500 AI_SERVICE_ERROR`.
- La receta generada es una sugerencia.
- La respuesta no se almacena.

### Respuesta 200

```json
{
  "data": {
    "title": "Tortilla de verduras",
    "mealType": "almuerzo",
    "servings": 3,
    "preparationTimeMinutes": 35,
    "ingredientsUsed": [
      {
        "name": "Huevo",
        "quantity": "2 unidades"
      },
      {
        "name": "Zanahoria",
        "quantity": "1 unidad"
      }
    ],
    "optionalIngredients": [
      "Queso rallado"
    ],
    "missingIngredients": [
      "Pimienta"
    ],
    "steps": [
      "Preparar ingredientes.",
      "Batir.",
      "Cocinar.",
      "Servir."
    ],
    "notes": "Receta generada por IA."
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

### Error relevante (inventario sin disponibilidad)

```json
{
  "error": {
    "code": "BUSINESS_RULE_ERROR",
    "message": "No available inventory products for recipe generation.",
    "details": ["inventory"]
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

### Error relevante (servicio IA)

```json
{
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "Failed to generate recipe using AI service.",
    "details": ["OpenAI timeout."]
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

# 10. DTOs principales

## CreateProductDto

```ts
{
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStock?: number;
}
```

## UpdateProductDto

```ts
{
  name?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  minimumStock?: number;
}
```

## UpdateProductQuantityDto

```ts
{
  quantity: number;
}
```

## CreateShoppingListItemDto

```ts
{
  productId: number;
  quantity: number;
  unit: string;
}
```

## PurchaseShoppingListItemDto

```ts
{
  purchasedQuantity: number;
}
```

## GenerateRecipeDto

```ts
{
  preferences?: {
    mealType?: 'desayuno' | 'almuerzo' | 'cena' | 'colacion' | 'cualquiera';
    maxPreparationMinutes?: number;
    servings?: number;
    dietaryRestrictions?: string[];
  };
}
```

---

# 11. Relación con requisitos

| Endpoint | Requisitos relacionados | Estado en código |
|---|---|---|
| GET /products | RF-005 | Implementado |
| GET /products/{id} | RF-005 | Implementado |
| POST /products | RF-001 | Implementado |
| PATCH /products/{id} | RF-002, RF-004, RF-013 | Implementado |
| DELETE /products/{id} | RF-003 | Implementado |
| GET /shopping-list | RF-008 | Implementado |
| POST /shopping-list/items | RF-009 | Implementado |
| POST /shopping-list/items/from-low-stock | RF-010 | Implementado |
| PATCH /shopping-list/items/{id}/purchase | RF-011, RF-012 | Implementado |
| DELETE /shopping-list/items/{id} | RF-008 | Implementado |
| PATCH /inventory/products/{id}/quantity | RF-004 | Planificado |
| GET /inventory/low-stock | RF-014 | Planificado |
| POST /recipes/generate | RF-015, RF-016, RF-017 | Implementado (OpenAI) |

---

# 12. Decisiones pendientes

| Tema | Estado |
|---|---|
| Categorías iniciales precargadas | Pendiente |
| Persistencia de recetas | Fuera del MVP |
| Autenticación | Fuera del MVP |
| Historial de compras | Fuera del MVP |
| Sincronización remota | Trabajo futuro |
| Formato exacto de errores de validación | Resuelto en Sprint 2.5 |