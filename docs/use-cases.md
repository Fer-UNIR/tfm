# Casos de Uso

# SmartPantry

Versión: 1.0

---

# 1. Introducción

Este documento describe los casos de uso funcionales del sistema SmartPantry.

Cada caso de uso representa una interacción entre el usuario y el sistema para alcanzar un objetivo concreto.

Los casos de uso mantienen la trazabilidad con los requisitos funcionales y las reglas de negocio definidas previamente.

---

# 2. Actor principal

## Usuario

Persona responsable de administrar el inventario doméstico y utilizar las funcionalidades de la aplicación.

---

# 3. Casos de uso

---

# UC-001 Registrar producto

## Objetivo

Registrar un nuevo producto en el inventario.

## Actor

Usuario

## Requisitos relacionados

RF-001

## Reglas de negocio

RN-INV-001

RN-INV-002

RN-INV-003

## Precondiciones

El usuario se encuentra en el inventario.

## Flujo principal

1. El usuario selecciona "Agregar producto".
2. El sistema solicita los datos.
3. El usuario completa la información.
4. El sistema valida los datos.
5. El sistema registra el producto.
6. El producto aparece en el inventario.

## Flujos alternativos

A1. El nombre ya existe.

→ El sistema informa el conflicto.

A2. Falta un campo obligatorio.

→ El sistema solicita corregir la información.

## Postcondiciones

El producto queda disponible para todas las funcionalidades.

---

# UC-002 Editar producto

## Objetivo

Modificar la información de un producto.

## Requisitos

RF-002

## Reglas

RN-INV-004

## Flujo principal

1. Seleccionar producto.
2. Elegir editar.
3. Modificar datos.
4. Guardar cambios.
5. Actualizar inventario.

---

# UC-003 Eliminar producto

## Objetivo

Eliminar un producto del inventario.

## Requisitos

RF-003

## Reglas

RN-INV-005

## Flujo principal

1. Seleccionar producto.
2. Confirmar eliminación.
3. El sistema elimina el producto.

---

# UC-004 Actualizar stock

## Objetivo

Modificar la cantidad disponible.

## Requisitos

RF-004

RF-013

RF-014

## Reglas

RN-STK-001

RN-STK-002

## Flujo principal

1. Seleccionar producto.
2. Modificar cantidad.
3. Guardar.
4. Recalcular estado del stock.

---

# UC-005 Consultar inventario

## Objetivo

Visualizar el inventario.

## Requisitos

RF-005

RF-006

RF-007

## Flujo principal

1. Abrir inventario.
2. El sistema muestra productos.
3. El usuario puede buscar y filtrar.

---

# UC-006 Crear lista de compras

## Objetivo

Gestionar la lista de compras.

## Requisitos

RF-008

RF-009

RF-010

## Reglas

RN-SHOP-001

RN-SHOP-002

RN-SHOP-003

## Flujo principal

1. Abrir lista.
2. Agregar productos.
3. Guardar lista.

---

# UC-007 Marcar producto como comprado

## Objetivo

Actualizar el estado de un producto comprado.

## Requisitos

RF-011

RF-012

## Reglas

RN-SHOP-005

RN-SHOP-006

## Flujo principal

1. Marcar producto como comprado.
2. Confirmar cantidad adquirida.
3. Actualizar inventario.
4. Eliminar de la lista de compras.

---

# UC-008 Generar receta

## Objetivo

Solicitar una receta utilizando IA.

## Requisitos

RF-015

RF-016

RF-017

## Reglas

RN-AI-001

RN-AI-002

RN-AI-003

RN-AI-004

RN-AI-005

## Precondiciones

El inventario contiene productos.

Existe conexión a Internet.

## Flujo principal

1. El usuario solicita generar receta.
2. El sistema obtiene el inventario.
3. Se envía la información al servicio de IA.
4. Se recibe la respuesta.
5. El sistema presenta la receta.

## Flujo alternativo

A1. No existe conexión.

→ Mostrar mensaje.

A2. La IA devuelve un error.

→ Mostrar mensaje y permitir reintentar.

A3. Inventario vacío.

→ Informar que no existen suficientes productos.

## Postcondiciones

La receta queda disponible para consulta durante la sesión.

---

# 4. Diagrama de casos de uso

Pendiente de elaboración.

Se incluirá un diagrama UML que represente gráficamente las relaciones entre el actor principal y los casos de uso del sistema.

---

# 5. Matriz de trazabilidad

| Caso de uso | Requisitos | Reglas |
|-------------|------------|--------|
| UC-001 | RF-001 | RN-INV-001, RN-INV-002 |
| UC-002 | RF-002 | RN-INV-004 |
| UC-003 | RF-003 | RN-INV-005 |
| UC-004 | RF-004, RF-013 | RN-STK-001, RN-STK-002 |
| UC-005 | RF-005, RF-006, RF-007 | RN-INV-006 |
| UC-006 | RF-008, RF-009, RF-010 | RN-SHOP-001, RN-SHOP-002, RN-SHOP-003 |
| UC-007 | RF-011, RF-012 | RN-SHOP-005, RN-SHOP-006 |
| UC-008 | RF-015, RF-016, RF-017 | RN-AI-001, RN-AI-002, RN-AI-003 |