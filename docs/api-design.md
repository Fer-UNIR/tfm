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
  "id": "uuid",
  "name": "Arroz",
  "categoryId": "uuid",
  "categoryName": "Despensa",
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
  "id": "uuid",
  "productId": "uuid",
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
  "ingredientsUsed": [
    "Arroz",
    "Zanahoria",
    "Cebolla"
  ],
  "missingIngredients": [
    "Salsa de soja"
  ],
  "steps": [
    "Cocer el arroz.",
    "Saltear las verduras.",
    "Mezclar y servir."
  ],
  "notes": "Receta sugerida por IA a partir del inventario disponible."
}
```

---

# 9. Endpoints

# 9.1 Health

## GET `/health`

Permite verificar que el backend está disponible.

### Respuesta 200

```json
{
  "data": {
    "status": "ok"
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

---

# 9.2 Productos

## GET `/products`

Obtiene todos los productos registrados.

### Respuesta 200

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Arroz",
      "categoryId": "uuid",
      "categoryName": "Despensa",
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
    "id": "uuid",
    "name": "Arroz",
    "categoryId": "uuid",
    "categoryName": "Despensa",
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
  "categoryId": "uuid",
  "quantity": 1,
  "unit": "kg",
  "minimumStock": 1
}
```

### Validaciones

- `name` obligatorio.
- `categoryId` obligatorio.
- `quantity` debe ser mayor o igual a 0.
- `unit` obligatorio.
- `minimumStock` opcional, pero si existe debe ser mayor o igual a 0.
- no debe existir otro producto con el mismo nombre y categoría.

### Respuesta 201

```json
{
  "data": {
    "id": "uuid",
    "name": "Arroz",
    "categoryId": "uuid",
    "categoryName": "Despensa",
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

## PUT `/products/{id}`

Actualiza un producto existente.

### Request

```json
{
  "name": "Arroz integral",
  "categoryId": "uuid",
  "quantity": 2,
  "unit": "kg",
  "minimumStock": 1
}
```

### Respuesta 200

```json
{
  "data": {
    "id": "uuid",
    "name": "Arroz integral",
    "categoryId": "uuid",
    "categoryName": "Despensa",
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

# 9.3 Categorías

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

# 9.4 Lista de compras

## GET `/shopping-list`

Obtiene los productos pendientes de compra.

### Respuesta 200

```json
{
  "data": [
    {
      "id": "uuid",
      "productId": "uuid",
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
  "productId": "uuid",
  "quantity": 1,
  "unit": "kg"
}
```

### Reglas

- La cantidad debe ser mayor que 0.
- Si el producto ya existe en la lista activa, se actualiza la cantidad.
- No se deben crear duplicados.

### Respuesta 201

```json
{
  "data": {
    "id": "uuid",
    "productId": "uuid",
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
- El elemento queda marcado como comprado o se elimina de la lista activa según la decisión de implementación.

### Respuesta 200

```json
{
  "data": {
    "shoppingItemId": "uuid",
    "productId": "uuid",
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

# 9.5 Inventario

## GET `/inventory/low-stock`

Obtiene productos bajo stock.

### Respuesta 200

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Arroz",
      "quantity": 1,
      "unit": "kg",
      "minimumStock": 1,
      "categoryName": "Despensa"
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

# 9.6 Recetas IA

## POST `/recipes/generate`

Genera una receta a partir del inventario disponible.

Las recetas no se almacenan en el MVP.

### Request

```json
{
  "preferences": {
    "maxPreparationMinutes": 30,
    "servings": 2,
    "dietaryRestrictions": []
  }
}
```

### Reglas

- Debe existir al menos un conjunto mínimo de productos disponibles.
- El backend consulta el inventario.
- El backend construye un prompt controlado.
- La solicitud a OpenAI se realiza únicamente desde backend.
- La receta generada es una sugerencia.
- La respuesta no se almacena.

### Respuesta 200

```json
{
  "data": {
    "title": "Arroz salteado con verduras",
    "ingredientsUsed": [
      "Arroz",
      "Zanahoria",
      "Cebolla"
    ],
    "missingIngredients": [
      "Salsa de soja"
    ],
    "steps": [
      "Cocer el arroz.",
      "Saltear las verduras.",
      "Mezclar y servir."
    ],
    "notes": "Receta generada como sugerencia a partir del inventario disponible."
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
  categoryId: string;
  quantity: number;
  unit: string;
  minimumStock?: number;
}
```

## UpdateProductDto

```ts
{
  name: string;
  categoryId: string;
  quantity: number;
  unit: string;
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
  productId: string;
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
    maxPreparationMinutes?: number;
    servings?: number;
    dietaryRestrictions?: string[];
  };
}
```

---

# 11. Relación con requisitos

| Endpoint | Requisitos relacionados |
|---|---|
| GET /products | RF-005 |
| GET /products/{id} | RF-005 |
| POST /products | RF-001 |
| PUT /products/{id} | RF-002 |
| DELETE /products/{id} | RF-003 |
| PATCH /inventory/products/{id}/quantity | RF-004 |
| GET /inventory/low-stock | RF-014 |
| POST /shopping-list/items | RF-009 |
| POST /shopping-list/items/from-low-stock | RF-010 |
| PATCH /shopping-list/items/{id}/purchase | RF-011, RF-012 |
| POST /recipes/generate | RF-015, RF-016, RF-017 |

---

# 12. Decisiones pendientes

| Tema | Estado |
|---|---|
| Categorías iniciales precargadas | Pendiente |
| Persistencia de recetas | Fuera del MVP |
| Autenticación | Fuera del MVP |
| Historial de compras | Fuera del MVP |
| Sincronización remota | Trabajo futuro |
| Formato exacto de errores de validación | Pendiente |