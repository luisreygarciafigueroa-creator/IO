# Significado operativo de las relaciones `mirrorOf` y `creates`

Este documento fija la semántica operativa exacta de las dos relaciones estructurales del marco IOM. Las definiciones se alinean con:

- las reglas en `data/iom_spec.json` (`creation_rules`);
- los predicados deterministas implementados en `src/iomEngine.ts` (`evaluatePairRule`, `ruleLabel`, `generateArtifacts`);
- los axiomas OWL y las formas SHACL en `ontology/`;
- los teoremas posicionales heredados de la formalización en Lean 4 (`IOM/Operators.lean`, `IOM/FormalRules.lean`).

La validez de una arista se determina de forma operativa según las reglas deterministas (comprobables mediante `POST /api/rule-check`, `src/iomEngine.test.ts`, SHACL y los conjuntos CSV canónicos).

---

## 1. `io:mirrorOf`

### Definición operativa

Una arista dirigida $A \xrightarrow{\text{mirrorOf}} B$ es válida **si y solo si** se cumplen simultáneamente:

1. **Misma tríada**: `triad_index(A) = triad_index(B)`.
2. **Fase opuesta**: `phase(A) ≠ phase(B)` (una es `adv`, la otra `ret`).
3. **Posición reflejada**: `local_pos(B) = 2 - local_pos(A)`:
   - posición 0 ↔ posición 2
   - posición 1 (`0`) ↔ posición 1 (`0`)
4. **Reciprocidad**: si $A \xrightarrow{\text{mirrorOf}} B$, entonces también $B \xrightarrow{\text{mirrorOf}} A$ (propiedad OWL simétrica).

### Ejemplos positivos

| Fuente | Destino | Justificación |
|--------|---------|---------------|
| `T01_adv_P0` (animal) | `T01_ret_P2` (animal) | misma tríada 1, fases opuestas, 0 ↔ 2 |
| `T01_adv_P1` (humano) | `T01_ret_P1` (humano) | centro se refleja en centro |
| `T06_adv_P2` (emisor) | `T06_ret_P0` (emisor) | 2 ↔ 0 |

### Ejemplos negativos

| Fuente | Destino | Motivo de rechazo |
|--------|---------|-------------------|
| `T01_adv_P0` | `T01_adv_P2` | misma fase |
| `T01_adv_P0` | `T01_ret_P0` | posición no reflejada (`0 ≠ 2 − 0`) |
| `T01_adv_P0` | `T13_ret_P2` | tríada distinta |
| `T01_adv_P0` | `T01_adv_P0` | reflexivo (excluido de candidatos) |

### Casos límite

- **Centro–centro:** permitido y obligatorio para el nodo central de cada tríada.
- **Misma etiqueta léxica:** irrelevante; la relación es puramente estructural (`fase + posición`).
- **Arista unidireccional:** no puede existir; el generador determinista y las formas SHACL imponen el par recíproco.

---

## 2. `io:creates`

### Definición operativa

Una arista dirigida $A \xrightarrow{\text{creates}} B$ es válida **si y solo si** se cumplen:

1. **Misma tríada**.
2. **Fase opuesta**.
3. **Una de las cuatro reglas de `creation_rules`**:

| `source_phase` | `source_positions` | `target_phase` | `target_positions` |
|---|---|---|---|
| `adv` | `{0, 2}` | `ret` | `{1}` |
| `adv` | `{1}` | `ret` | `{0, 2}` |
| `ret` | `{1}` | `adv` | `{0, 2}` |
| `ret` | `{0, 2}` | `adv` | `{1}` |

En lenguaje natural: un lateral crea el centro de la fase opuesta, y el centro crea ambos laterales de la fase opuesta.

### Ejemplos positivos

| Fuente | Destino | Regla aplicada |
|--------|---------|----------------|
| `T01_adv_P0` (animal) | `T01_ret_P1` (humano) | `adv` lateral → `ret` centro |
| `T01_adv_P1` (humano) | `T01_ret_P0` (IA) | `adv` centro → `ret` 0 |
| `T01_adv_P1` (humano) | `T01_ret_P2` (animal) | `adv` centro → `ret` 2 |
| `T01_ret_P1` (humano) | `T01_adv_P0` (animal) | `ret` centro → `adv` 0 |

### Ejemplos negativos

| Fuente | Destino | Motivo |
|--------|---------|--------|
| `T01_adv_P0` | `T01_ret_P0` | lateral no crea lateral |
| `T01_adv_P0` | `T01_ret_P2` | lateral no crea el otro lateral |
| `T01_adv_P0` | `T01_adv_P1` | misma fase |
| `T01_adv_P1` | `T01_ret_P1` | centro no crea centro |

### Casos límite

- **Múltiples destinos:** el centro produce **dos** aristas `creates` (una hacia cada lateral).
- **No simétrica:** `creates` no es simétrica ni funcional; el grafo de creación es bipartito por fase.
- **Disjunción con `mirrorOf`:** un par puede ser `mirrorOf` **o** `creates`, nunca ambas a la vez.
- **Ausencia de arista:** cualquier par que no satisfaga las reglas anteriores se etiqueta `none`.

---

## 3. Correspondencia entre TypeScript, Lean y SHACL

| Concepto | TypeScript (`src/iomEngine.ts`) | Legado Lean / SHACL / OWL |
|---|---|---|
| Posición reflejada | `evaluatePairRule` (`t.pos === 2 - s.pos`) | `Operators.lean` / `sh:equals` |
| Fase opuesta | `s.phase !== t.phase` | predicados de fase / `sh:not` sobre `hasPhase` |
| Reglas de creación | `creation_rules` evaluado dinámicamente | formas SHACL sobre las cuatro combinaciones |
| Simetría de `mirrorOf` | `78` aristas dirigidas (39 pares simétricos) | `owl:SymmetricProperty` |

Las pruebas deterministas en `src/iomEngine.test.ts` verifican que los candidatos generados satisfacen exactamente estas reglas (`78 mirrorOf + 104 creates + 208 none = 390`).
