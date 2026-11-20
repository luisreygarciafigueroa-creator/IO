# Manual de alineación: cartografía del destino Mictlán

> El Mictlán **no** es un dominio empírico más. Es la **lectura de destino** del marco (disolución del observador, autocreación desde el vacío). Otros dominios constituyen ejercicios secundarios. **No** existe «prueba primaria EXP-A» que legitime el mapeo.
>
> [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md) · [`DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md) · [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md) · [`TCAAU.md`](TCAAU.md)

---

## 1. Invarianza del núcleo

Setenta y ocho nodos (`13 × 2 × 3`) forman la bóveda técnica. Los conceptos externos se alinean **sin** alterar `data/iom_spec.json`, `src/iomEngine.ts` ni la arquitectura `{4,3,3}`.

| Perspectiva | Lectura bajo autonomía |
|---|---|
| Individualidad | Singularidad autocreada |
| Dualidad | Polaridad en disolución |
| Totalidad | Totalidad propia (sin contenedor exterior) |
| Evolución (4ª) | Mictecacíhuatl — el recorrido del Mictlán concluye en la condición correspondiente |
| Involución (5ª) | Mictlantecuhtli — el recorrido concluye en la condición complementaria |

Detalle: [`VECTORES_4_5.md`](VECTORES_4_5.md) · [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md).

---

## 2. Relaciones formales

Únicamente `mirrorOf` y `creates` (reglas canónicas). El resto se etiqueta como `none`.

Garantías: `npm run lint`, `npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts` y `POST /api/rule-check`.  
Detalle: [`RELACIONES_OPERATIVAS.md`](RELACIONES_OPERATIVAS.md).

---

## 3. Protocolo de mapeo y verificación

1. Identificar el fenómeno o umbral de tránsito.
2. Asignar perspectiva (`Ind` / `D` / `Tot`).
3. Asignar fase y vector (`adv–Evol` o `ret–Invol`).
4. Anclar al `node_id` correspondiente entre los setenta y ocho nodos (`T01`–`T13`).
5. Evaluar la arista (`mirrorOf` / `creates` / `none`) mediante `POST /api/rule-check` o en `experiments/domain_mapping/examples.json`.
6. Validar con `GET /api/domain-mapping` (pestaña **Dominio (EXP-E) & Quiz**).

**No se exige** panel ciego para «aprobar» el mapeo.

---

## 4. Mictlán — destino, no ejemplo

Documento: [`DOMINIO_COSMOS_NAHUATL.md`](DOMINIO_COSMOS_NAHUATL.md).  
Cosmología: [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md).  
Ensayo: [`DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md).

| Concepto | Perspectiva | Relación |
|---|---|---|
| Camino al Mictlán (tránsito) | Involución → autonomía | `creates` |
| Mictecacíhuatl ↔ Mictlantecuhtli | Evolución / Involución | `mirrorOf` |
| Disolución observador → tejido | Individualidad → Totalidad | `creates` |
| Autocreación desde el vacío | Individualidad / Totalidad | — |

`EXP-E` comprueba expresabilidad estructural; **no** constituye validación de campo ni κ de dominio.

---

## 5. Suite (lectura actualizada)

| ID | Rol |
|----|-----|
| EXP-B / EXP-C | Autonomía formal y estructural |
| EXP-E | Destino Mictlán expresable en trece tríadas |
| EXP-D | Autogeneración sintética (registro histórico) |
| EXP-A | Residuo; no fundamento |

Flujo completo: [`../EXPERIMENTOS.md`](../EXPERIMENTOS.md).
