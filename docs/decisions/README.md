# Architecture Decision Records (ADR)

## Proposito

Esta carpeta almacena las decisiones de arquitectura relevantes del proyecto SmartPantry-TFM para mantener trazabilidad tecnica y academica durante todo el MVP.

Cada ADR documenta:

- contexto de la decision,
- decision tomada,
- consecuencias,
- alternativas consideradas.

## Convencion de nombres

Formato de archivo:

`ADR-XXX-nombre-descriptivo.md`

Ejemplos:

- `ADR-001-backend-framework.md`
- `ADR-003-sqlite-without-orm.md`

## Estado de ADR

Estados permitidos:

- Proposed
- Accepted
- Superseded
- Deprecated

Cuando un ADR cambie por una nueva decision, el ADR nuevo debe referenciar al anterior y el anterior debe marcarse como `Superseded`.

## Plantilla recomendada

```markdown
# ADR-XXX: Titulo

- Estado: Accepted
- Fecha: YYYY-MM-DD

## Contexto
...

## Decision
...

## Consecuencias
...

## Alternativas consideradas
- Alternativa A
- Alternativa B
```

