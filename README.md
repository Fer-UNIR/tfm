# SmartPantry

> Trabajo Fin de Máster – Máster Universitario en Ingeniería de Software

SmartPantry es una aplicación móvil que permite gestionar el inventario doméstico de alimentos, facilitar la planificación de compras y generar recetas mediante Inteligencia Artificial utilizando los ingredientes disponibles.

El proyecto se desarrolla como prototipo funcional para el Trabajo Fin de Máster y prioriza una arquitectura modular, mantenible y fácilmente extensible.

---

# Objetivos

## Objetivo general

Desarrollar un prototipo funcional de aplicación móvil que permita gestionar el inventario doméstico de alimentos y asistir al usuario en la planificación de compras y recetas mediante Inteligencia Artificial.

## Objetivos específicos

- Gestionar productos del inventario.
- Actualizar cantidades disponibles.
- Gestionar listas de compra.
- Detectar productos bajo stock.
- Generar recetas mediante IA utilizando los productos disponibles.
- Diseñar una arquitectura modular preparada para futuras ampliaciones.

---

# Tecnologías

## Frontend

- React Native
- TypeScript

## Backend

- NestJS
- TypeScript

## Persistencia

- SQLite

## Inteligencia Artificial

- OpenAI API

---

# Arquitectura

El sistema se organiza en cuatro componentes principales:

- Aplicación móvil (React Native)
- Backend API (NestJS)
- Persistencia local (SQLite)
- Servicio externo OpenAI para generación de recetas

La lógica de negocio reside en el backend, manteniendo el frontend desacoplado de la persistencia y de los servicios de Inteligencia Artificial.

---

# Estructura del repositorio

```text
smartpantry-tfm/
│
├── .cursor/
│   ├── rules/
│   └── skills/
│
├── docs/
│   ├── architecture.md
│   ├── api-design.md
│   ├── business-rules.md
│   ├── glossary.md
│   ├── requirements.md
│   ├── roadmap.md
│   ├── test-plan.md
│   ├── improvements.md
│   ├── technical-debt.md
│   ├── use-cases.md
│   ├── vision.md
│   └── decisions/
│
├── frontend/
├── backend/
│
├── README.md
├── LICENSE
└── .gitignore
```

---

# Documentación

La documentación técnica del proyecto se encuentra en la carpeta `docs`.

| Documento | Descripción |
|-----------|-------------|
| vision.md | Visión del producto |
| requirements.md | Requisitos funcionales y no funcionales |
| business-rules.md | Reglas de negocio |
| use-cases.md | Casos de uso |
| architecture.md | Arquitectura del sistema |
| api-design.md | Diseño de la API |
| roadmap.md | Plan de desarrollo |
| test-plan.md | Estrategia de pruebas |
| improvements.md | Registro de mejoras técnicas y de calidad |
| technical-debt.md | Registro de deuda técnica priorizada |
| glossary.md | Glosario del proyecto |

---

# Estado del proyecto

Actualmente el proyecto se encuentra en **Fase 5: recetas con IA (en preparación)**.

- backend NestJS inicializado;
- frontend Expo + TypeScript inicializado;
- endpoint `GET /api/v1/health` disponible;
- CRUD base de productos en backend:
  - `GET /api/v1/products`
  - `GET /api/v1/products/:id`
  - `POST /api/v1/products`
  - `PATCH /api/v1/products/:id`
  - `DELETE /api/v1/products/:id`
- contrato de errores REST estabilizado con formato uniforme `error/meta` para `400`, `404`, `409` y `500`;
- configuración básica de SQLite en backend;
- **Fase 3 frontend de inventario completada**:
  - pantalla móvil de inventario conectada a `products`;
  - estados de carga, vacío y error;
  - alta de producto simple;
  - edición de cantidad (`+1` / `-1`);
  - eliminación de producto;
  - indicador de bajo stock (`quantity <= minimumStock`);
  - pruebas de componente para `InventoryScreen` con React Native Testing Library.
- **Fase 4 lista de compras completada**:
  - módulo backend `ShoppingListModule` con arquitectura `Controller -> Service -> Repository`;
  - endpoints implementados:
    - `GET /api/v1/shopping-list`
    - `POST /api/v1/shopping-list/items`
    - `POST /api/v1/shopping-list/items/from-low-stock`
    - `PATCH /api/v1/shopping-list/items/:id/purchase`
    - `DELETE /api/v1/shopping-list/items/:id`
  - regla de no duplicados en lista activa (si existe item pendiente, se actualiza su cantidad);
  - al marcar compra, se incrementa inventario en `products.quantity`;
  - navegación básica frontend entre `InventoryScreen` y `ShoppingListScreen` sin librerías adicionales;
  - pantalla `ShoppingListScreen` en frontend con estados de carga, vacío y error;
  - operaciones frontend:
    - alta manual con selección de producto existente;
    - sincronización completa desde bajo stock;
    - agregado individual desde bajo stock;
    - marcar compra individual;
    - marcar todos los pendientes como comprados (resumen de éxito/error parcial);
    - eliminación de item;
  - pruebas unitarias/e2e de backend y pruebas de componente frontend para compras.

El foco actual de implementación pasa a **Fase 5: recetas con IA**.

Roadmap actualizado:

- **Fase 6**: refinamiento funcional y experiencia de usuario (sin nuevas reglas de negocio).
- **Fase 7**: calidad.
- **Fase 8**: documentación del TFM.

---

# Puesta en marcha local

## Requisitos previos

- Node.js 22+ (recomendado 24+)
- npm
- Expo Go o emulador (para frontend)

## 1) Backend

```bash
cd backend
npm install
npm run start:dev
```

Health check:

```bash
curl http://localhost:3000/api/v1/health
```

Ejemplo rápido de alta de producto:

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arroz",
    "category": "Despensa",
    "quantity": 1,
    "unit": "kg",
    "minimumStock": 1
  }'
```

Ejemplo de respuesta de error (producto duplicado):

```json
{
  "error": {
    "code": "DUPLICATE_RESOURCE",
    "message": "A product with the same name and category already exists.",
    "details": ["name", "category"]
  },
  "meta": {
    "timestamp": "2026-01-01T12:00:00.000Z"
  }
}
```

Variables de entorno de ejemplo:

```bash
cp .env.example .env
```

> `backend/.env.example` no incluye claves reales.

## 2) Frontend

```bash
cd frontend
npm install
npm run start
```

Variables de entorno de ejemplo:

```bash
cp .env.example .env
```

`frontend/.env.example` define:

- `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1`

Con backend y frontend levantados, la aplicación móvil permite alternar entre `InventoryScreen` y `ShoppingListScreen` de Fase 4 y consume tanto `products` como `shopping-list`.

---

# Licencia

Este repositorio se distribuye bajo la licencia indicada en `LICENSE`.