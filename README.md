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
| glossary.md | Glosario del proyecto |

---

# Estado del proyecto

Actualmente el proyecto se encuentra en **Fase 2 (gestion de inventario - backend de productos)**:

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
- pantalla inicial móvil preparada para consumir backend.

En esta fase **no** se implementa aún frontend de inventario, lista de compras ni integración de recetas IA.

---

# Puesta en marcha (Fase 1)

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

Con backend y frontend levantados, la pantalla inicial ejecuta el health check y muestra el estado de API y SQLite.

---

# Licencia

Este repositorio se distribuye bajo la licencia indicada en `LICENSE`.