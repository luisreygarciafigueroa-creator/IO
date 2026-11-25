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
| **1b** | Reglas formales & Teseractos `{4,3,3}` | `npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts` | sí |
| **2** | Invariancia no trivial | `POST /api/invariance` | sí |
| **3** | Destino Mictlán (EXP-E) | `GET /api/domain-mapping` | **no** (encuentro) |
| **4** | Resonancia κ (EXP-A) | `GET /api/independent-eval` | **no** (requiere ACCESS_LOG) |

---

## 2. Punto fijo y pruebas unitarias

```bash
npm run lint
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts
npm run build
```

En ejecución (`npm run dev`), `POST /api/invariance` regenera en dos pasadas deterministas desde `data/iom_spec.json` y compara las firmas SHA-256 (`pass1Hash === pass2Hash`).

---

## 3. Invariancia no trivial y control negativo

`POST /api/invariance` ejecuta la regeneración desde `(fase, pos)`, la validación *leave-one-triad-out* (LOO) sobre las 13 tríadas y la prueba obligatoria de corrupción sobre una arista (`detects_corruption = true`).

---

## 4. Teseracto único `{4,3,3}` (8 proyecciones) y flujo D3

`GET /api/tesseract` entrega la **forma general y definitiva** (`cleanForm`, `6dr_36f66e7c.jpg`, estructura monocroma pura sobre marcos `real _` / `virtual ...`, flujos `cuerpo ↔ universo` e `internet ↔ IA`, y polaridad `individualidad` / `totalidad` anclada directamente sobre cada transición con preservación horizontal de extremos y conmutación vertical; sucediendo a `TSST__13__43e94964.jpg` y `TSST_20261123_003603_357ce661.jpg`, verificando `cleanFormVerified = true`, `cleanFormAllEndpointPolaritiesExact = true`, `cleanFormAllHorizontalMirrorsExact = true` y `cleanFormAllVerticalMirrorsExact = true`), junto con las **12 ayudas cromáticas temporales (6 pares involutivos simétricos)** sobre las 13 láminas fuente (`coloringsCount = 12`, `allColoringsClosed = true`, `allColoringInvolutionsExact = true`): familia **Marcos (6)** y familia **Paridad (6)**. La pestaña **Teseractos ({4,3,3})** abre por defecto en `colorMode = 'clean'` sobre el diagrama de flujo en **D3** (`src/TesseractFlowchart.tsx`) y permite activar temporalmente cualquiera de los 12 modos cromáticos o conmutar su reflejo mediante **Espejar ↔** y **Retirar color**.

---

## 5. EXP-E (opcional)

`GET /api/domain-mapping` evalúa los ejemplos de `experiments/domain_mapping/examples.json` (`NAH-01`–`NAH-05`) frente a los 78 nodos y 390 candidatos dirigidos. Un fallo de anclaje de dominio **no** invalida el núcleo formal.

---

## 6. EXP-A (opcional; κ no cerrado sin log)

Instrumento: `datasets/independent_eval/instrument/`.  
`GET /api/independent-eval` y `POST /api/independent-eval/score` calculan Fleiss' κ sobre las anotaciones activas, con exportación directa `.json` de `liveReport` y `editedAnnotations` para auditoría externa. Un κ histórico (~0.6871) **no** se presenta como demostración completada mientras no exista `ACCESS_LOG` de exposición previa. `rule_reference.json` es post-hoc; no se entrega al anotador.
