# IOM — Construcción formal de la unidad informativa y arquitectura TCAAU

Este documento sintetiza el repositorio **IOM** como una **construcción formal de unidad informativa** articulada con la **Teoría de la Creación Autónoma Absoluta del Universo (TCAAU)**: una arquitectura autocontenida de distinciones, relaciones, integración y transformaciones verificable de manera determinista desde `data/iom_spec.json`, el motor en TypeScript (`src/iomEngine.ts`, `src/tesseractFlowGraph.ts`) y las ocho proyecciones (`2 × 4`) de un único teseracto (`{4,3,3}`).

La **autonomía verificable** constituye el mecanismo de constitución y validación interna; los anotadores externos, la alineación con dominios culturales y los algoritmos de recuperación de reglas pertenecen al orden del **encuentro**, no al del fundamento.

Referencias principales:
- Tratado sistemático TCAAU: [`docs/TCAAU.md`](docs/TCAAU.md)
- Reconstrucción formal (Teoremas 1–11): [`docs/TCAAU_RECONSTRUCCION_ACADEMICA.md`](docs/TCAAU_RECONSTRUCCION_ACADEMICA.md)
- Criterio de no-subordinación: [`docs/DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md`](docs/DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md)
- Sentido filosófico y cosmología: [`docs/DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](docs/DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md) · [`docs/COSMOLOGIA_DEL_MICTLAN.md`](docs/COSMOLOGIA_DEL_MICTLAN.md)
- Especificación y jerarquía experimental: [`data/iom_spec.json`](data/iom_spec.json) · [`EXPERIMENTOS.md`](EXPERIMENTOS.md)

---

## 1. Propósito y definición formal

> **Definición canónica.** La unidad informativa es la mínima estructura autocontenida capaz de conservar una distinción, relacionarla con su opuesto, integrarla en un sistema y transformarse sin perder la trazabilidad de su identidad.

Las cinco perspectivas —**Individualidad, Dualidad, Totalidad, Evolución e Involución**— operan en ciclo modular $\mathbb{Z}_5$, mientras que las **trece tríadas** (`78` nodos en fases de avance `adv` y retroceso `ret`) constituyen modos de composición estructural, no una taxonomía descriptiva externa.

En el plano ontológico superior (TCAAU), los siete individuos $\mathcal{C} = \{U, \emptyset, M_{\mathrm{mat}}, N, C, A, M\}$ y los clasificadores $\mathcal{D} = \{r, v\}$ forman un torsor bajo $(\mathbb{Z}_2)^3$ isomorfo a las ocho celdas cúbicas de un único teseracto $\{4,3,3\}$, satisfaciendo el criterio de realidad por no-subordinación ($D11$) bajo lectura modal (Teorema 11).

---

## 2. Núcleo autónomo (fundamento verificable en Node.js 22 + TypeScript)

La validez del sistema como arquitectura formal se comprueba de manera determinista mediante cuatro capas ejecutables (`src/iomEngine.ts`, `src/tesseractFlowGraph.ts`, `server.ts`):

1. **Punto fijo idempotente ($S_{n+1} = S_n$):** `generateArtifacts()` (`GET /api/spec` y `POST /api/invariance`) regenera en dos pasadas los **78** nodos, **20** pasos vectoriales (`4 × 5`), **21** categorías expandidas y **390** candidatos dirigidos (`78 mirrorOf + 104 creates + 208 none`) con identidad criptográfica SHA-256 entre pasadas.
2. **Reglas formales e invariancia no trivial:** `evaluatePairRule()` y `runInvarianceAudit()` (`POST /api/rule-check` y `POST /api/invariance`) reproducen los predicados originalmente formalizados en Lean 4 / SHACL, verifican reconstrucción *leave-one-triad-out* (13/13 tríadas) e imponen el control negativo obligatorio (`detects_corruption = true` ante la mutación de cualquier arista).
3. **Modelo del teseracto único `{4,3,3}` (forma general definitiva + ayudas cromáticas) y diagrama de flujo D3:** `buildTesseractModel()` (`GET /api/tesseract`) verifica la **forma general y definitiva** (`cleanForm`, `TSST__13__43e94964.jpg`, sucediendo a `TSST_20261123_003603_357ce661.jpg`, `cleanFormVerified = true` sobre `8` proyecciones y `16` transiciones en `real _` / `virtual ...` con polaridad `individualidad` / `totalidad` anclada a cada transición, `cleanFormAllEndpointPolaritiesExact = true` e inversión H/V exacta) junto con las **12 ayudas cromáticas temporales en 6 pares involutivos** (`coloringsCount = 12`, `allColoringsClosed = true`, `allColoringInvolutionsExact = true`, `allMirrorReflectedChainsBalanced = true`, `allParityMirrorChainsBalanced = true`, `allMirrorChainsBalanced = true`, `allAnalysisChainsBalanced = true`), alimentando la visualización dinámica con **D3** en `src/TesseractFlowchart.tsx` (por defecto en modo `'clean'` y conmutación opcional hacia los 12 modos cromáticos).
4. **Suite de pruebas unitarias y tipado estricto:** `npm run lint` (`tsc --noEmit`), `npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts` y `npm run build`.

---

## 3. Encuentro (no fundamenta)

- **EXP-E (cartografía del tránsito / dominio náhuatl):** `GET /api/domain-mapping` comprueba la expresabilidad del destino Mictlán (`NAH-01`–`NAH-05`) dentro del vocabulario de 13 tríadas. Un desajuste de mapeo no invalida el núcleo.
- **EXP-A (concordancia interanotador residual):** `GET /api/independent-eval` calcula Fleiss' $\kappa \approx 0.6871$ sobre los 14 pares históricos y 3 anotadores. En ausencia de `ACCESS_LOG` de no-exposición previa —y por principio epistemológico de autonomía absoluta—, el consenso externo se documenta como archivo residual y nunca como demostración fundante.

---

## 4. Diagnóstico circular (contexto histórico)

Los modelos sintéticos de referencia (`PI-HGAT-T` y perceptrones multicapa en el archivo experimental) alcanzan una exactitud de `1.0000` bajo partición *leave-one-triad-out* porque las etiquetas `mirrorOf` y `creates` son funciones deterministas ya codificadas en `(fase, posición)`. Dicha recuperabilidad confirma consistencia formal interna, pero constituye una tautología informacional y **no** demuestra validez empírica en el mundo externo.

---

## 5. Límite de la afirmación

El repositorio **implementa y verifica** una construcción formal de unidad informativa y su articulación con la ontología combinatoria de la TCAAU. No afirma por sí solo una teoría física empíricamente falsable ni pretende derivar verdades naturales del consenso estadístico; su validez interna se mide estrictamente por derivabilidad, invariancia y trazabilidad determinista desde la especificación canónica.
