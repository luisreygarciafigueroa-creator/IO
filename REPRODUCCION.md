# Reproducción

**Runtime:** Node.js 22 (`npm`) con servidor Express + Vite/React + D3 en TypeScript (`puerto 3000`, host `0.0.0.0`).  
**Especificaciones fuente:** `data/iom_spec.json` (`spec_version` `1.10.0`) y núcleo TCAAU `data/tcaau_core.json` (esquema `data/tcaau_core.schema.json`, texto canónico en `public/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf`).

## Arranque, pruebas y compilación

```bash
npm install
npm run lint                                                                                   # Verificación estricta de tipos TypeScript (tsc --noEmit)
npx tsx --test src/iomEngine.test.ts src/tcaauCore.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts    # Pruebas unitarias deterministas (reglas, núcleo TCAAU, teseractos, D3, exportación y specData)
npm run build                                                                                  # Compila el cliente React/Vite en dist/
npm run dev                                                                                    # Inicia servidor Express + Vite en http://0.0.0.0:3000
npm start                                                                                      # Sirve la aplicación compilada en producción (node server.ts)
```

## Núcleo verificado en TypeScript (`src/iomEngine.ts`, `src/tcaauCore.ts` y `src/tesseractFlowGraph.ts`)

La lógica estructural del repositorio se ejecuta de forma determinista y sin estado externo a partir de `data/iom_spec.json` y `data/tcaau_core.json`:

1. **Punto fijo idempotente ($S_{n+1} = S_n$):** `GET /api/spec` y `POST /api/invariance` generan en dos pasadas los **78** nodos (`13 × 2 × 3`), **20** pasos vectoriales (`4 × 5`), **21** categorías expandidas y **390** candidatos dirigidos (`78 mirrorOf + 104 creates + 208 none = 390`), verificando igualdad SHA-256 entre pasadas; la pestaña **Núcleo & 13 Tríadas** incluye un panel lateral colapsable (`src/SpecMetadataSidePanel.tsx`) con los metadatos completos de `specData` en JSON coloreado para auditoría técnica.
2. **Núcleo formal TCAAU legible por máquina (`GET /api/tcaau-core`):** `verifyTcaauCore()` (`src/tcaauCore.ts`) contrasta `data/tcaau_core.json` contra el motor vivo y `MANIFEST.sha256` verificando axiomas `A1–A8`, proposiciones `R1–R8`, definiciones `D10–D13`, Corolario `D11/P11`, la acción $(\mathbb{Z}_2)^3$ de `G` (`§11.1`) y la integración del sitio (`§§11.2–11.6`), `39` pares `mirrorOf` (`26` laterales + `13` de centro para `D12`/`R2`–`R3`), `32` trazas y ciclo de cuatro términos de la superposición `§7.7`, el quiasmo `materia = vacío`, Teoremas `T1–T11` (`T12` propuesto con ruta prioritaria de localización), Ideas `I1–I8` y programa `P1–P7`, con hash SHA-256 idempotente (`corePass1Hash === corePass2Hash`), expuesto interactivamente en `src/TcaauCoreSection.tsx`.
3. **Reglas formales (`FormalRules`):** `POST /api/rule-check` evalúa `sameTriad`, `oppositePhase`, `mirrorPositional` y `createsPositional` para cualquier par de los 78 nodos.
4. **Teseracto único `{4,3,3}` (forma general definitiva `2 × 4` + 12 ayudas cromáticas) y diagrama de flujo D3:** `GET /api/tesseract` entrega las **8** proyecciones (`T1–T8`, `2 × 4` sobre planos de inversión) en su **forma general y definitiva** (`cleanForm`, `LRGF_68fba07a.jpg`, preservando `6dr__1__0283eca1.jpg` como Figura 3 de `§7.6.5`, verificando `cleanFormVerified = true`, `cleanFormCheckerboardDomainValid = true`, `cleanFormOneLoopPerCell = true`, `cleanFormEachArrowBalancedByDomain = true`, `cleanFormAllHaveOneRealOneVirtual = true`, `cleanFormOmitsPolarityLabels = true`, `cleanFormAllHorizontalMirrorsExact = true`, `cleanFormAllVerticalMirrorsExact = true`) junto con las **12 ayudas cromáticas temporales (6 pares involutivos simétricos)** sobre 15 láminas fuente y el texto canónico TCAAU en PDF (`canonicalPdfPath = '/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf'`), alimentando `buildTesseractFlowGraph` (`src/tesseractFlowGraph.ts`) y `TesseractFlowchart` (`src/TesseractFlowchart.tsx`).
5. **Invariancia interna y control negativo:** `POST /api/invariance` verifica tasa de auto-regeneración `1.0`, invariancia por índice de tríada, reconstrucción LOO sobre las 13 tríadas y detección obligatoria de corrupción al alterar una arista (`detects_corruption = true`).

## Encuentro y evaluación (opcional)

- **EXP-E (alineación de dominio náhuatl):** `GET /api/domain-mapping` valida `experiments/domain_mapping/examples.json` (`NAH-01`–`NAH-05`) frente a los 78 nodos y 390 pares canónicos.
- **EXP-A (evaluación independiente / Fleiss' κ):** `GET /api/independent-eval` y `POST /api/independent-eval/score` calculan Fleiss' κ (`0.6871` sobre 14 pares y 3 anotadores, `null ≠ unsure`) con soporte interactivo de edición y descarga `.json` de `liveReport` + `editedAnnotations` (`src/evalAuditExport.ts`) en la interfaz web.
- **Autoevaluación de protocolo ciego:** `GET /api/quiz` y `POST /api/quiz/score` evalúan las preguntas `Q1`–`Q4` de `experiments/learning/quiz_blind_protocol.json`.

## Alcance de la migración

Las pruebas originales en Lean 4 (`lake build`), la serialización/validación RDF-SHACL (`rdflib`, `pyshacl`, `owlrl`) y el diagnóstico sintético en PyTorch (`PI-HGAT-T`) corresponden al histórico previo a la migración a Node.js; su equivalencia combinatoria, de reglas y de invariancia se ejecuta directamente en `src/iomEngine.ts` y `src/*.test.ts`.

## Cinco perspectivas

Individualidad, Dualidad, Totalidad, Evolución, Involución — no «cuatro operadores» como eje del modelo.
