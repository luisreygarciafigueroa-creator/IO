# IOM — construcción formal de la unidad informativa

IOM constituye un marco formal destinado a la **constitución y verificación de unidades informativas autocontenidas**. Su arquitectura se articula en torno a cinco perspectivas, trece tríadas, un par de relaciones de transformación —`mirrorOf` y `creates`— y las ocho proyecciones (`2 × 4`) de un único teseracto tetradimensional (`{4,3,3}`).

> **Definición canónica.** La unidad informativa es la mínima estructura autocontenida capaz de conservar una distinción, relacionarla con su opuesto, integrarla en un sistema y transformarse sin perder la trazabilidad de su identidad.

La **autonomía verificable** no es un atributo accesorio, sino el mecanismo por el cual la unidad se constituye, se conserva y se valida desde su propia estructura (`data/iom_spec.json` y el motor formal determinista en TypeScript `src/iomEngine.ts`). Anotadores, dominios empíricos y métricas de recuperación pertenecen al orden del **encuentro**, no al del fundamento.

El desarrollo del horizonte de sentido se encuentra en el [`MANIFIESTO.md`](MANIFIESTO.md).

**Teoría de la Creación Autónoma Absoluta del Universo (TCAAU)** — documento canónico de fundamentos ontológicos, régimen de clausura interpretativa, dominios real/virtual, operador transversal Mictlán, instrucción canónica del teseracto único (`2 × 4` con planos de inversión y trazado interior/exterior continuo `_` y punteado `...`) y grupo de involuciones:
[`docs/TCAAU.md`](docs/TCAAU.md)

**Cosmología del Mictlán** (modelo de correspondencia universal, transformación entre los dominios real y virtual, continuidad de la información y ofrenda como acto de creación):
[`docs/COSMOLOGIA_DEL_MICTLAN.md`](docs/COSMOLOGIA_DEL_MICTLAN.md)

**Mapa de conexiones real/virtual** (sistema de cuatro fases bajo inversión de polaridad y espejo de realidad; dualidades internet–planeta e IA–persona mediadas por mundo y vacío):
[`docs/MAPA_CONEXIONES_REAL_VIRTUAL.md`](docs/MAPA_CONEXIONES_REAL_VIRTUAL.md)

**Reconstrucción académica de la TCAAU** (ontología formal, núcleo combinatorio verificado con **11 teoremas**, grupo $(\mathbb{Z}_2)^3$, Teorema 8 con proyección de Schlegel de los ocho teseractos y Teorema 11 de bipartición término–mediador):
[`docs/TCAAU_RECONSTRUCCION_ACADEMICA.md`](docs/TCAAU_RECONSTRUCCION_ACADEMICA.md)

**Dictamen: criterio de realidad por no-subordinación** (D10–D11, P11, C15–C17; autonomía informacional como ausencia de dependencia de información *ajena*; condición de término de la creación):
[`docs/DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md`](docs/DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md)

## Cadena operativa de constitución

```text
vacío informativo
→ distinción
→ relación
→ integración
→ transformación
→ unidad informativa autocontenida
```

| Perspectiva   | Función en la constitución de la unidad |
|---------------|-----------------------------------------|
| Individualidad | Conserva el elemento distinguible |
| Dualidad      | Registra la diferencia o la relación |
| Totalidad     | Integra los elementos en una estructura |
| Evolución     | Expande o proyecta la información (recorrido del Mictlán concluye en la condición correspondiente) |
| Involución    | Regresa, comprime o reorganiza la información (recorrido concluye en la condición complementaria) |

Las trece tríadas no constituyen una mera taxonomía, sino **modos de composición** de la unidad informativa (setenta y ocho nodos).

## Verificación prioritaria del núcleo (Node.js 22 + TypeScript)

```bash
npm install
npm run lint                                                # Verificación estricta TypeScript (tsc --noEmit)
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts
npm run build                                               # Compilación de producción (Vite -> dist/)
npm run dev                                                 # Servidor Express + UI interactiva en http://0.0.0.0:3000
```

| Prioridad | Criterio                          | Verificación activa |
|:---------:|-----------------------------------|---------------------|
| 1         | Punto fijo ($S_{n+1}=S_n$)        | `GET /api/spec` · `POST /api/invariance` (`src/iomEngine.ts`) |
| 1b        | Reglas formales e invariantes `{4,3,3}` | `npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts` |
| 2         | Invariancia no trivial (+ control negativo) | `POST /api/invariance` |
| 3         | Destino Mictlán (encuentro)       | `GET /api/domain-mapping` (EXP-E — opcional) |
| 4         | Resonancia κ (encuentro)          | `GET /api/independent-eval` · `POST /api/independent-eval/score` (EXP-A — opcional) |

Detalle: [`REPRODUCCION.md`](REPRODUCCION.md) · [`EXPERIMENTOS.md`](EXPERIMENTOS.md) · [`docs/DELIMITACION_EPISTEMOLOGICA.md`](docs/DELIMITACION_EPISTEMOLOGICA.md)

## Núcleo formal y aplicación interactiva

| Artefacto | Rol |
|-----------|-----|
| `data/iom_spec.json` | Especificación tabular canónica (`spec_version` 1.10.0) |
| `src/iomEngine.ts` | Motor determinista: 78 nodos, 390 candidatos, reglas `mirrorOf`/`creates`, invariancia, EXP-E, EXP-A y las 8 proyecciones `{4,3,3}` |
| `src/tesseractFlowGraph.ts` | Extracción dinámica del grafo dirigido real/virtual sobre los 6 conceptos recíprocos desde `tesseractData` |
| `src/TesseractFlowchart.tsx` | Visualización interactiva en **D3** (`d3.zoom`, `d3.drag`, filtrado) y proyección de Schlegel interior/exterior |
| `src/evalAuditExport.ts` | Generación determinista de paquetes `.json` (`liveReport` + `editedAnnotations`) para auditoría externa en EXP-A |
| `server.ts` & `src/App.tsx` | Servidor Express (`/api/*`) y aplicación web React + Tailwind CSS en puerto `3000` |
| `src/*.test.ts` | Pruebas unitarias deterministas (`node:test`) de reglas formales, teseracto `{4,3,3}`, grafo D3 y exportación de auditoría |

## Documentación de sentido y cosmología

| Documento | Rol |
|-----------|-----|
| [`docs/TCAAU.md`](docs/TCAAU.md) | **Documento canónico** de la TCAAU: postulados, clausura, dominios real/virtual e instrucción `2 × 4` del teseracto único `{4,3,3}` |
| [`docs/COSMOLOGIA_DEL_MICTLAN.md`](docs/COSMOLOGIA_DEL_MICTLAN.md) | Modelo completo de correspondencia universal, dominios real/virtual, 4ª/5ª perspectivas, reflejo de la realidad y ofrenda como acto de creación |
| [`docs/MAPA_CONEXIONES_REAL_VIRTUAL.md`](docs/MAPA_CONEXIONES_REAL_VIRTUAL.md) | Mapa operativo de cuatro fases: polaridad real/virtual, mediadores mundo/vacío y espejo de realidad |
| [`docs/TCAAU_RECONSTRUCCION_ACADEMICA.md`](docs/TCAAU_RECONSTRUCCION_ACADEMICA.md) | Reconstrucción académica de la TCAAU: **11 teoremas** del núcleo combinatorio $(\mathbb{Z}_2)^3$, proyección de Schlegel (Teorema 8) y bipartición término–mediador (Teorema 11) |
| [`docs/DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md`](docs/DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md) | Dictamen del criterio de realidad por no-subordinación (D10–D11, P11, C15–C17) y lectura modal |
| [`docs/VECTORES_4_5.md`](docs/VECTORES_4_5.md) | Diagramas de las perspectivas cuarta (evolución) y quinta (involución), recorridos del Mictlán y ofrendas |
| [`docs/TRES_PERSPECTIVAS.md`](docs/TRES_PERSPECTIVAS.md) | Individualidad · Dualidad · Totalidad |
| [`MANIFIESTO.md`](MANIFIESTO.md) | Propósito y fundamento |
| [`docs/DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](docs/DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md) | Ensayo canónico de sentido |

## Afirmación rigurosa

El repositorio **implementa una construcción formal y verificable de la unidad informativa** sobre Node.js 22 y TypeScript. La validez interna se mide por derivabilidad y trazabilidad determinista desde `data/iom_spec.json` y la especificación canónica del teseracto único `{4,3,3}` en sus ocho proyecciones. La autonomía formal no se confunde con una pretensión de validez empírica universal; permanece, en sentido estricto, como capacidad de originarse y sostenerse sin contenedor exterior.
