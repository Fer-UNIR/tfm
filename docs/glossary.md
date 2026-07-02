# Glosario

# SmartPantry

Versión: 1.0

---

# Propósito

Este glosario reúne los principales términos técnicos y funcionales utilizados en el proyecto SmartPantry.

Su objetivo es mantener una terminología consistente entre la documentación, el desarrollo del software y la memoria del Trabajo Fin de Máster.

---

| Término | Definición |
|---------|------------|
| API | Interfaz que permite la comunicación entre la aplicación móvil y el backend mediante servicios REST. |
| API REST | Estilo arquitectónico utilizado para exponer los servicios del backend mediante recursos HTTP. |
| Backend | Parte del sistema encargada de la lógica de negocio, persistencia e integración con servicios externos. |
| Business Rule | Regla que define el comportamiento del dominio del negocio independientemente de la tecnología utilizada. |
| Caso de uso | Descripción de una interacción entre el usuario y el sistema para alcanzar un objetivo concreto. |
| Categoría | Agrupación lógica utilizada para clasificar productos del inventario. |
| DTO (Data Transfer Object) | Objeto utilizado para transportar información entre cliente y servidor de forma controlada y validada. |
| Endpoint | Dirección específica de la API que permite acceder a un recurso o ejecutar una operación determinada. |
| Frontend | Aplicación móvil con la que interactúa el usuario. |
| IA Generativa | Modelo de Inteligencia Artificial capaz de generar contenido nuevo a partir de una solicitud. En SmartPantry se utiliza para generar recetas. |
| Inventario | Conjunto de productos disponibles en el hogar registrados por el usuario. |
| JSON | Formato utilizado para intercambiar información entre el frontend y el backend. |
| MVP (Minimum Viable Product) | Primera versión funcional del producto que implementa únicamente las funcionalidades esenciales. |
| NestJS | Framework utilizado para desarrollar el backend del proyecto. |
| OpenAI API | Servicio externo utilizado para generar recetas mediante Inteligencia Artificial. |
| Persistencia | Mecanismo utilizado para almacenar y recuperar información del sistema. |
| Producto | Alimento registrado por el usuario dentro del inventario. |
| Prompt | Instrucción enviada al modelo de Inteligencia Artificial para solicitar la generación de una receta. |
| React Native | Framework utilizado para desarrollar la aplicación móvil multiplataforma. |
| Repositorio | Componente encargado de abstraer el acceso a la capa de persistencia. |
| Requisito funcional | Funcionalidad que el sistema debe proporcionar al usuario. |
| Requisito no funcional | Restricción o característica de calidad que debe cumplir el sistema. |
| SQLite | Motor de base de datos relacional utilizado para la persistencia local del MVP. |
| Stock | Cantidad disponible de un producto en el inventario. |
| Stock mínimo | Cantidad mínima definida para un producto antes de recomendar su reposición. |
| TFM | Trabajo Fin de Máster desarrollado como parte del Máster Universitario en Ingeniería de Software. |
| TypeScript | Lenguaje utilizado tanto en el frontend como en el backend, basado en JavaScript con tipado estático. |
| Unidad de medida | Forma en que se expresa la cantidad de un producto (por ejemplo: unidades, gramos, kilogramos o litros). |
| Usuario | Persona que utiliza SmartPantry para gestionar el inventario, la lista de compras y generar recetas. |
| UUID | Identificador único utilizado para distinguir cada entidad del sistema. |
| Validación | Proceso mediante el cual el sistema verifica que los datos recibidos cumplen las reglas definidas antes de procesarlos. |
| Capa de persistencia | Conjunto de servicios o repositorios responsables de abstraer el acceso al almacenamiento de datos, permitiendo sustituir la tecnología de persistencia sin afectar la lógica de negocio. |

---

# Acrónimos

| Acrónimo | Significado |
|-----------|-------------|
| ADR | Architecture Decision Record |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| DTO | Data Transfer Object |
| HTTP | HyperText Transfer Protocol |
| IA | Inteligencia Artificial |
| JSON | JavaScript Object Notation |
| MVP | Minimum Viable Product |
| REST | Representational State Transfer |
| SRS | Software Requirements Specification |
| TFM | Trabajo Fin de Máster |
| UI | User Interface |
| UUID | Universally Unique Identifier |

---

# Convenciones utilizadas

- Los nombres de endpoints se expresan utilizando notación REST.
- Los nombres de recursos de la API se escriben en inglés (`products`, `shopping-list`, `recipes`).
- Los nombres de clases y DTOs siguen la convención de TypeScript y NestJS.
- Los documentos técnicos utilizan terminología consistente con este glosario.