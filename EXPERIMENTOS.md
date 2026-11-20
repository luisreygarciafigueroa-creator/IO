# Experimentos del marco I.O. — unidad informativa

> Propósito: construcción formal de **unidad informativa**. La autonomía verificable constituye el mecanismo de constitución y validación.

> Manifiesto: [`MANIFIESTO.md`](MANIFIESTO.md) · Reproducción: [`REPRODUCCION.md`](REPRODUCCION.md) · Cosmología: [`docs/COSMOLOGIA_DEL_MICTLAN.md`](docs/COSMOLOGIA_DEL_MICTLAN.md)

El marco se autoconstituye. Lo externo pertenece al orden del **encuentro**, no al del fundamento.

**Intérprete y entorno:** Node.js 22 (`npm` + `tsx`) ejecutando el motor formal en `src/iomEngine.ts` y la interfaz en `http://0.0.0.0:3000`.

---

## 1. Jerarquía de prioridades

| Prioridad | Capa | Runner / Endpoint | ¿Bloquea «repo válido»? |
|:---------:|------|-------------------|:-----------------------:|
| **1** | Punto fijo ($S_{n+1}=S_n$) | `GET /api/spec` · `POST /api/invariance` | sí |
| **1b** | Reglas formales & Teseractos `{4,3,3}` | `npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts` | sí |
| **2** | Invariancia no trivial | `POST /api/invariance` | sí |
| **3** | Destino Mictlán (EXP-E) | `GET /api/domain-mapping` | **no** (encuentro) |
| **4** | Resonancia κ (EXP-A) | `GET /api/independent-eval` | **no** (requiere ACCESS_LOG) |

---

## 2. Punto fijo y pruebas unitarias

```bash
npm run lint
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts
npm run build
```

En ejecución (`npm run dev`), `POST /api/invariance` regenera en dos pasadas deterministas desde `data/iom_spec.json` y compara las firmas SHA-256 (`pass1Hash === pass2Hash`).

---

## 3. Invariancia no trivial y control negativo

`POST /api/invariance` ejecuta la regeneración desde `(fase, pos)`, la validación *leave-one-triad-out* (LOO) sobre las 13 tríadas y la prueba obligatoria de corrupción sobre una arista (`detects_corruption = true`).

---

## 4. Teseractos `{4,3,3}` y flujo D3

`GET /api/tesseract` entrega las 8 configuraciones cúbicas (`T1–T8` en disposición `2 × 4`), sus 16 transiciones sobre los 7 conceptos (`universo, materia, vacio, internet, cuerpo, IA, mictlan`) y las invariantes de dirección (`>`/`<`), balance y trazado (`_`/`...`). La pestaña **Teseractos ({4,3,3})** renderiza dinámicamente el diagrama de flujo en **D3** (`src/TesseractFlowchart.tsx`).

---

## 5. EXP-E (opcional)

`GET /api/domain-mapping` evalúa los ejemplos de `experiments/domain_mapping/examples.json` (`NAH-01`–`NAH-05`) frente a los 78 nodos y 390 candidatos dirigidos. Un fallo de anclaje de dominio **no** invalida el núcleo formal.

---

## 6. EXP-A (opcional; κ no cerrado sin log)

Instrumento: `datasets/independent_eval/instrument/`.  
`GET /api/independent-eval` y `POST /api/independent-eval/score` calculan Fleiss' κ sobre las anotaciones activas. Un κ histórico (~0.6871) **no** se presenta como demostración completada mientras no exista `ACCESS_LOG` de exposición previa. `rule_reference.json` es post-hoc; no se entrega al anotador.
