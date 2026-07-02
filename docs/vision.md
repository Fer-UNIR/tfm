# SmartPantry Vision

## 1. Visión del producto

SmartPantry es una aplicación móvil que ayuda a las personas a gestionar el inventario de alimentos de su hogar de forma simple e inteligente.

El objetivo es reducir el desperdicio de alimentos, facilitar la planificación de compras y aprovechar mejor los ingredientes disponibles mediante la asistencia de Inteligencia Artificial.

El producto busca convertirse en un asistente cotidiano para la organización de la despensa y la preparación de comidas, reduciendo el tiempo dedicado a tareas domésticas relacionadas con la alimentación.

---

# 2. Problema

Muchas personas desconocen qué alimentos tienen disponibles en casa, qué productos están por agotarse o qué ingredientes pueden utilizar para cocinar.

Como consecuencia:

- se compran productos duplicados;
- se olvidan alimentos hasta que caducan;
- aumenta el desperdicio alimentario;
- resulta difícil decidir qué cocinar con los ingredientes disponibles;
- la planificación de compras suele realizarse de forma manual y poco eficiente.

Aunque existen aplicaciones que cubren parte de estas necesidades, pocas integran de forma sencilla la gestión del inventario, las listas de compra y la generación inteligente de recetas en una única solución.

---

# 3. Propuesta de valor

SmartPantry centraliza la gestión doméstica de alimentos mediante tres funcionalidades principales:

- gestión del inventario;
- gestión de listas de compra;
- generación de recetas utilizando Inteligencia Artificial a partir de los alimentos disponibles.

La aplicación pretende minimizar el esfuerzo requerido para mantener actualizado el inventario y ofrecer recomendaciones útiles durante el proceso de planificación de comidas.

---

# 4. Usuarios objetivo

## Usuario principal

Personas que cocinan habitualmente en su hogar y desean mantener un mayor control sobre los alimentos disponibles.

## Usuarios secundarios

- parejas;
- familias;
- estudiantes;
- personas que viven solas;
- usuarios interesados en reducir desperdicio alimentario.

---

# 5. Objetivos del producto

## Objetivo general

Desarrollar un prototipo funcional de aplicación móvil que permita gestionar el inventario doméstico de alimentos y asistir al usuario en la planificación de compras y recetas mediante Inteligencia Artificial.

## Objetivos específicos

- Registrar productos del inventario.
- Actualizar cantidades disponibles.
- Gestionar listas de compra.
- Detectar productos bajo stock.
- Generar recetas utilizando únicamente productos disponibles.
- Facilitar futuras ampliaciones mediante una arquitectura modular.

---

# 6. Alcance del MVP

El MVP incluirá:

- catálogo de productos;
- categorías básicas;
- gestión de inventario;
- actualización de stock;
- lista de compras;
- stock mínimo configurable;
- generación de recetas mediante OpenAI;
- almacenamiento local;
- backend modular preparado para crecimiento.

---

# 7. Fuera de alcance

No forman parte del MVP:

- autenticación avanzada;
- sincronización entre múltiples dispositivos;
- funcionalidades colaborativas;
- marketplace;
- integración con supermercados;
- lectura automática mediante códigos de barras;
- reconocimiento de productos mediante visión artificial;
- planificación nutricional;
- control de calorías;
- recomendaciones médicas;
- monetización.

---

# 8. Principios de diseño

El desarrollo priorizará:

- simplicidad de uso;
- interfaz intuitiva;
- arquitectura modular;
- mantenibilidad;
- escalabilidad;
- separación entre frontend y backend;
- uso responsable de la Inteligencia Artificial;
- documentación técnica completa.

---

# 9. Tecnologías previstas

Frontend

- React Native
- TypeScript

Backend

- NestJS
- TypeScript

Persistencia

- SQLite para el prototipo
- Arquitectura preparada para PostgreSQL

Inteligencia Artificial

- OpenAI API

---

# 10. Criterios de éxito

El MVP se considerará exitoso cuando permita:

- gestionar correctamente el inventario;
- gestionar listas de compra;
- generar recetas coherentes utilizando los ingredientes disponibles;
- demostrar una arquitectura modular fácilmente extensible;
- servir como evidencia práctica del Trabajo Fin de Máster.

---

# 11. Visión futura

Una vez validado el MVP, el sistema podrá evolucionar para incorporar:

- sincronización en la nube;
- múltiples usuarios por hogar;
- reconocimiento automático de productos;
- integración con supermercados;
- planificación semanal de comidas;
- recomendaciones nutricionales;
- notificaciones inteligentes;
- análisis del desperdicio alimentario;
- aprendizaje de preferencias del usuario mediante IA.