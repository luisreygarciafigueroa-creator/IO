# Experimentos del marco I.O. — unidad informativa y núcleo TCAAU

> Propósito: construcción formal de **unidad informativa** fundamentada en la **TCAAU** (`public/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf`). La verificación ejecutable desde dentro ($I6$, `§11.3–§11.4`) constituye el único control legítimo de una teoría sin exterior.

> Manifiesto: [`MANIFIESTO.md`](MANIFIESTO.md) · Reproducción: [`REPRODUCCION.md`](REPRODUCCION.md) · Núcleo legible por máquina: [`data/tcaau_core.json`](data/tcaau_core.json) (`src/tcaauCore.ts`)

El marco se autoconstituye. Lo externo pertenece al orden del **encuentro**, no al del fundamento.

**Intérprete y entorno:** Node.js 22 (`npm` + `tsx`) ejecutando el motor formal en `src/iomEngine.ts`, el verificador TCAAU en `src/tcaauCore.ts` y la interfaz en `http://0.0.0.0:3000`.

---

## 1. Jerarquía de prioridades

| Prioridad | Capa | Runner / Endpoint | ¿Bloquea «repo válido»? |
|:---------:|------|-------------------|:-----------------------:|
| **1** | Punto fijo ($S_{n+1}=S_n$) & Núcleo TCAAU | `GET /api/spec` · `GET /api/tcaau-core` · `POST /api/invariance` | sí |
| **1b** | Reglas formales, `R1–R8`/`D12–D13`/`§7.7` & Teseractos `{4,3,3}` | `npx tsx --test src/iomEngine.test.ts src/tcaauCore.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts` | sí |
| **2** | Invariancia no trivial | `POST /api/invariance` | sí |
| **3** | Destino Mictlán (EXP-E) | `GET /api/domain-mapping` | **no** (encuentro) |
| **4** | Resonancia κ (EXP-A) | `GET /api/independent-eval` | **no** (requiere ACCESS_LOG) |

---

## 2. Punto fijo, módulo TCAAU y pruebas unitarias

```bash
npm run lint
npx tsx --test src/iomEngine.test.ts src/tcaauCore.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts
npm run build
```

En ejecución (`npm run dev`), `POST /api/invariance` regenera en dos pasadas deterministas desde `data/iom_spec.json` y compara las firmas SHA-256 (`pass1Hash === pass2Hash`), mientras `GET /api/tcaau-core` verifica de forma idempotente el núcleo formal de `data/tcaau_core.json` (incluidos `§11.1–§11.6`, el criterio de clausura y la batería comprobable `P1–P7`).

---

## 3. Invariancia no trivial y control negativo

`POST /api/invariance` ejecuta la regeneración desde `(fase, pos)`, la validación *leave-one-triad-out* (LOO) sobre las 13 tríadas y la prueba obligatoria de corrupción sobre una arista (`detects_corruption = true`).

---

## 4. Teseracto único `{4,3,3}` (8 proyecciones, superposición `§7.7`) y flujo D3

`GET /api/tesseract` entrega la **forma general y definitiva** (`cleanForm`, `13LRGF_2c1d1cb4.jpg` del 28 de noviembre —preservando `LRGF_68fba07a.jpg` del 27 de noviembre y `6dr__1__0283eca1.jpg` como Figura 3 de `§7.6.5`—, estructura monocroma pura en doble eje simétrico `continuo = real` en `{T1, T4, T6, T7}` y `continuo = materia` en `{T2, T3, T5, T8}`, con 1 transición recta y 1 bucle por celda, sentido horario `↻` (`›`) en `T1–T4` y antihorario `↺` (`‹`) en `T5–T8`, biyección exacta flecha ↔ etiqueta de marco y `2 rectas + 2 bucles` por cada una de las 4 flechas dirigidas, sin etiquetas auxiliares de polaridad y con inversión vertical exacta por columna, junto con la ruta al texto canónico PDF `canonicalPdfPath`), así como las **12 ayudas cromáticas temporales (6 pares involutivos simétricos)** sobre las láminas fuente (`coloringsCount = 12`, `allColoringsClosed = true`, `allColoringInvolutionsExact = true`). Por su parte, `GET /api/tcaau-core` verifica la superposición `§7.7` (`32` trazas, `8` flechas dirigidas × `4` ocurrencias, ciclo de cuatro `internet – universo – IA – cuerpo – internet`, `R8` y análisis final `materia = vacío` por quiasmo exacto). La pestaña **Teseractos ({4,3,3})** abre por defecto en `colorMode = 'clean'` sobre el diagrama de flujo en **D3** (`src/TesseractFlowchart.tsx`).

---

## 5. EXP-E (opcional)

`GET /api/domain-mapping` evalúa los ejemplos de `experiments/domain_mapping/examples.json` (`NAH-01`–`NAH-05`) frente a los 78 nodos y 390 candidatos dirigidos. Un fallo de anclaje de dominio **no** invalida el núcleo formal.

---

## 6. EXP-A (opcional; κ no cerrado sin log)

Instrumento: `datasets/independent_eval/instrument/`.  
`GET /api/independent-eval` y `POST /api/independent-eval/score` calculan Fleiss' κ sobre las anotaciones activas, con exportación directa `.json` de `liveReport` y `editedAnnotations` para auditoría externa. Un κ histórico (~0.6871) **no** se presenta como demostración completada mientras no exista `ACCESS_LOG` de exposición previa. `rule_reference.json` es post-hoc; no se entrega al anotador.
