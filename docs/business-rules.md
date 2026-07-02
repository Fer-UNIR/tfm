# Reglas de negocio

# SmartPantry

Versión: 1.0

---

# 1. Propósito

Este documento define las reglas de negocio del proyecto SmartPantry.

Las reglas de negocio describen el comportamiento esperado del dominio de inventario doméstico, lista de compras y generación de recetas asistida por Inteligencia Artificial, independientemente de la implementación técnica.

---

# 2. Alcance

Estas reglas aplican al MVP de SmartPantry y sirven como base para:

- requisitos funcionales;
- casos de uso;
- diseño de API;
- modelo de datos;
- pruebas;
- validación del prototipo.

---

# 3. Inventario doméstico

## RN-INV-001 Registro de producto

Todo producto registrado en el inventario debe tener, como mínimo:

- nombre;
- categoría;
- cantidad disponible;
- unidad de medida.

---

## RN-INV-002 Nombre de producto

El nombre del producto no puede estar vacío.

El sistema debe evitar registrar productos duplicados con el mismo nombre y categoría dentro del mismo inventario.

---

## RN-INV-003 Cantidad disponible

La cantidad disponible de un producto no puede ser negativa.

---

## RN-INV-004 Actualización de stock

Cuando el usuario modifica la cantidad disponible de un producto, el sistema debe conservar el nuevo valor como cantidad actual del inventario.

---

## RN-INV-005 Eliminación de producto

Cuando un producto se elimina del inventario, deja de estar disponible para:

- generación de recetas;
- detección de bajo stock;
- sugerencias de compra.

---

## RN-INV-006 Categoría obligatoria

Todo producto debe pertenecer a una categoría.

Las categorías permiten organizar el inventario y facilitar la búsqueda de productos.

---

# 4. Stock mínimo

## RN-STK-001 Stock mínimo

Un producto puede tener un stock mínimo configurado.

El stock mínimo representa la cantidad por debajo de la cual se recomienda reponer el producto.

---

## RN-STK-002 Producto bajo stock

Un producto se considera bajo stock cuando su cantidad disponible es menor o igual a su stock mínimo configurado.

---

## RN-STK-003 Stock mínimo opcional

Si un producto no tiene stock mínimo configurado, no debe considerarse bajo stock automáticamente.

---

## RN-STK-004 Reposición sugerida

Cuando un producto está bajo stock, el sistema puede sugerir agregarlo a la lista de compras.

---

# 5. Lista de compras

## RN-SHOP-001 Creación de lista

El usuario puede crear o mantener una lista de compras con productos pendientes de adquirir.

---

## RN-SHOP-002 Agregar producto manualmente

El usuario puede agregar manualmente productos a la lista de compras.

---

## RN-SHOP-003 Agregar producto desde bajo stock

El sistema puede agregar productos bajo stock a la lista de compras.

---

## RN-SHOP-004 Evitar duplicados

Un mismo producto no debe aparecer duplicado en la lista de compras activa.

Si el producto ya existe en la lista, el sistema debe actualizar la cantidad requerida en lugar de crear una nueva entrada.

---

## RN-SHOP-005 Marcar producto como comprado

El usuario puede marcar un producto de la lista de compras como comprado.

---

## RN-SHOP-006 Movimiento hacia inventario

Cuando un producto se marca como comprado, el sistema debe permitir incorporarlo al inventario.

---

## RN-SHOP-007 Cantidad comprada

La cantidad comprada debe ser mayor que cero.

---

# 6. Recetas asistidas por IA

## RN-AI-001 Generación basada en inventario

La generación de recetas debe utilizar como entrada principal los productos disponibles en el inventario.

---

## RN-AI-002 Uso de productos disponibles

La receta generada debe priorizar ingredientes disponibles en el inventario.

---

## RN-AI-003 Ingredientes faltantes

Si la receta incluye ingredientes no disponibles, el sistema debe identificarlos como ingredientes faltantes.

---

## RN-AI-004 Respuesta no determinista

El sistema debe considerar que una misma solicitud puede generar respuestas diferentes debido al comportamiento no determinista de la IA generativa.

---

## RN-AI-005 Validación de entrada

El sistema no debe solicitar una receta si el inventario no contiene productos suficientes para generar una recomendación útil.

---

## RN-AI-006 Naturaleza sugerida de la receta

Las recetas generadas por IA deben presentarse como sugerencias, no como instrucciones garantizadas, médicas o nutricionales.

---

## RN-AI-007 Seguridad de claves

Las claves de acceso a servicios de IA no deben exponerse en la aplicación móvil.

---

## RN-AI-008 Persistencia de recetas

Las recetas generadas por IA no serán almacenadas en el MVP.

Cada solicitud de generación utilizará el estado actual del inventario y producirá una nueva respuesta independiente.

---

# 7. Persistencia

## RN-DATA-001 Persistencia de datos

El sistema debe conservar los productos, cantidades, categorías y lista de compras entre sesiones.

---

## RN-DATA-002 Consistencia de inventario

Las operaciones de creación, actualización y eliminación deben mantener un inventario consistente.

---

## RN-DATA-003 Integridad de cantidades

Ninguna operación debe producir cantidades negativas en inventario o lista de compras.

---

# 8. Validaciones generales

## RN-VAL-001 Campos obligatorios

El sistema debe impedir guardar entidades con campos obligatorios vacíos.

---

## RN-VAL-002 Unidades de medida

Las cantidades deben estar asociadas a una unidad de medida.

---

## RN-VAL-003 Mensajes de error

Cuando una operación no pueda completarse, el sistema debe entregar un mensaje comprensible para el usuario.

---

# 9. Reglas fuera de alcance del MVP

No forman parte del MVP:

- cálculo nutricional;
- recomendaciones médicas;
- multiusuario;
- compras online;
- integración con supermercados;
- escaneo de códigos de barra;
- reconocimiento de alimentos mediante cámara;
- sincronización avanzada entre dispositivos.

---

# 10. Relación con requisitos

| Regla | Requisitos relacionados |
|---|---|
| RN-INV-001 | RF-001, RF-005 |
| RN-INV-002 | RF-001, RF-002 |
| RN-INV-003 | RF-004 |
| RN-STK-001 | RF-013 |
| RN-STK-002 | RF-014 |
| RN-SHOP-003 | RF-010 |
| RN-SHOP-005 | RF-011 |
| RN-SHOP-006 | RF-012 |
| RN-AI-001 | RF-015 |
| RN-AI-003 | RF-017 |
| RN-DATA-001 | RF-018, RF-019 |