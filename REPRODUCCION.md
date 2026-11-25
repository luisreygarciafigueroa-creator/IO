# Reproducción

**Runtime:** Node.js 22 (`npm`) con servidor Express + Vite/React + D3 en TypeScript (`puerto 3000`, host `0.0.0.0`).  
**Especificación fuente:** `data/iom_spec.json` (`spec_version` `1.10.0`).

## Arranque, pruebas y compilación

```bash
npm install
npm run lint                                                           # Verificación estricta de tipos TypeScript (tsc --noEmit)
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts    # Pruebas unitarias (reglas, teseractos, grafo D3, exportación JSON y panel specData)
npm run build                                                          # Compila el cliente React/Vite en dist/
npm run dev                                                            # Inicia servidor Express + Vite en http://0.0.0.0:3000
npm start                                                              # Sirve la aplicación compilada en producción (node server.ts)
```

## Núcleo verificado en TypeScript (`src/iomEngine.ts` y `src/tesseractFlowGraph.ts`)

La lógica estructural del repositorio se ejecuta de forma determinista y sin estado externo a partir de `data/iom_spec.json`:

1. **Punto fijo idempotente ($S_{n+1} = S_n$):** `GET /api/spec` y `POST /api/invariance` generan en dos pasadas los **78** nodos (`13 × 2 × 3`), **20** pasos vectoriales (`4 × 5`), **21** categorías expandidas y **390** candidatos dirigidos (`78 mirrorOf + 104 creates + 208 none = 390`), verificando igualdad SHA-256 entre pasadas; la pestaña **Núcleo & 13 Tríadas** incluye un panel lateral colapsable (`src/SpecMetadataSidePanel.tsx`) que muestra los metadatos completos de `specData` en JSON coloreado y filtrable para auditoría técnica.
2. **Reglas formales (`FormalRules`):** `POST /api/rule-check` evalúa `sameTriad`, `oppositePhase`, `mirrorPositional` y `createsPositional` para cualquier par de los 78 nodos.
3. **Teseracto único `{4,3,3}` (forma limpia definitiva + 12 ayudas cromáticas) y diagrama de flujo D3:** `GET /api/tesseract` entrega las **8** proyecciones (`T1–T8`, `2 × 4` sobre planos de inversión) en su **forma limpia y definitiva** (`cleanForm`, `TSST_20261123_003603_357ce661.jpg`, verificando `cleanFormVerified = true`, `cleanFormAllRealSolidVirtualDashed = true`, `cleanFormAllHaveOneRightOneLeft = true`, `cleanFormAllHorizontalMirrorsExact = true`, `cleanFormAllVerticalMirrorsExact = true`) junto con las **12 ayudas cromáticas temporales (6 pares involutivos simétricos)** sobre 11 láminas fuente (`coloringsCount = 12`, `allColoringsClosed = true`, `allColoringInvolutionsExact = true`, `allMirrorReflectedChainsBalanced = true`, `allParityMirrorChainsBalanced = true`, `allMirrorChainsBalanced = true`, `allAnalysisChainsBalanced = true`), alimentando `buildTesseractFlowGraph` (`src/tesseractFlowGraph.ts`) y `TesseractFlowchart` (`src/TesseractFlowchart.tsx`, por defecto en `'clean'` con acceso a los 12 modos cromáticos temporales).
4. **Invariancia interna y control negativo:** `POST /api/invariance` verifica tasa de auto-regeneración `1.0`, invariancia por índice de tríada, reconstrucción LOO sobre las 13 tríadas y detección obligatoria de corrupción al alterar una arista (`detects_corruption = true`).

## Encuentro y evaluación (opcional)

- **EXP-E (alineación de dominio náhuatl):** `GET /api/domain-mapping` valida `experiments/domain_mapping/examples.json` (`NAH-01`–`NAH-05`) frente a los 78 nodos y 390 pares canónicos.
- **EXP-A (evaluación independiente / Fleiss' κ):** `GET /api/independent-eval` y `POST /api/independent-eval/score` calculan Fleiss' κ (`0.6871` sobre 14 pares y 3 anotadores, `null ≠ unsure`) con soporte interactivo de edición y descarga `.json` de `liveReport` + `editedAnnotations` (`src/evalAuditExport.ts`) en la interfaz web.
- **Autoevaluación de protocolo ciego:** `GET /api/quiz` y `POST /api/quiz/score` evalúan las preguntas `Q1`–`Q4` de `experiments/learning/quiz_blind_protocol.json`.

## Alcance de la migración

Las pruebas originales en Lean 4 (`lake build`), la serialización/validación RDF-SHACL (`rdflib`, `pyshacl`, `owlrl`) y el diagnóstico sintético en PyTorch (`PI-HGAT-T`) corresponden al histórico previo a la migración a Node.js; su equivalencia combinatoria, de reglas y de invariancia se ejecuta directamente en `src/iomEngine.ts` y `src/*.test.ts`.

## Cinco perspectivas

Individualidad, Dualidad, Totalidad, Evolución, Involución — no «cuatro operadores» como eje del modelo.
