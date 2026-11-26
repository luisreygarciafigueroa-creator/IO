# Auditoría IOM — autofundamentación y encuentros

**Jerarquía canónica:** [`EXPERIMENTOS.md`](EXPERIMENTOS.md) · [`REPRODUCCION.md`](REPRODUCCION.md)  
**Delimitación:** [`docs/DELIMITACION_EPISTEMOLOGICA.md`](docs/DELIMITACION_EPISTEMOLOGICA.md)  
**Cosmología:** [`docs/COSMOLOGIA_DEL_MICTLAN.md`](docs/COSMOLOGIA_DEL_MICTLAN.md)

## 1. Capa primaria — autonomía (punto fijo e invariantes)

El repositorio es **válido como sistema** si, y solo si:

1. `npm run lint` (`tsc --noEmit`) y `npm run build` compilan sin errores.
2. `npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts` aprueba todas las pruebas deterministas (reglas formales, las 8 proyecciones del teseracto único `{4,3,3}`, grafo D3, exportación de auditoría `.json` y tokenización del panel JSON `specData`).
3. `GET /api/spec` y `POST /api/invariance` regeneran en dos pasadas idénticas los **78** nodos, **20** pasos vectoriales y **390** candidatos (`78 mirrorOf + 104 creates + 208 none`) con identidad SHA-256 ($S_{n+1}=S_n$), inspeccionables desde el panel lateral colapsable de auditoría JSON en la pestaña **Núcleo**.
4. `POST /api/invariance` reporta invariancia **no trivial** con detección obligatoria de corrupción (`detects_corruption = true`).
5. `GET /api/tesseract` verifica tanto la **nueva forma general y definitiva** (`6dr__1__0283eca1.jpg`, sucediendo a `6dr_36f66e7c.jpg`, `TSST__13__43e94964.jpg` y `TSST_20261123_003603_357ce661.jpg`, `cleanFormVerified = true`, `cleanFormAllRealSolidVirtualDashed = true`, `cleanFormAllHaveOneRightOneLeft = true`, `cleanFormOmitsPolarityLabels = true`, `cleanFormAllHorizontalMirrorsExact = true`, `cleanFormAllVerticalMirrorsExact = true`) como las **12 ayudas cromáticas temporales en 6 pares involutivos** (14 láminas fuente) con `coloringsCount = 12`, `allColoringsClosed = true`, `allColoringInvolutionsExact = true`, `allRealUseRightArrow = true`, `allHaveOneRealOneVirtual = true`, `allHaveOneContinuousOneDashed = true`, `allCubeLinesMatchHeader = true`, `allMirrorReflectedChainsBalanced = true`, `allParityMirrorChainsBalanced = true`, `allMirrorChainsBalanced = true` y `allAnalysisChainsBalanced = true`.

## 2. Capa secundaria — invariancia

Regeneración de etiquetas desde `(fase, pos)`; validación LOO por cada una de las 13 tríadas; detección inmediata ante la alteración de una arista.

## 3. Encuentro — EXP-E y EXP-A (no fundamentan)

| Experimento | Rol | Canal en la plataforma |
|-------------|-----|------------------------|
| EXP-E (dominio / Mictlán) | Expresabilidad del destino Mictlán; un fallo de anclaje **no** invalida el núcleo | `GET /api/domain-mapping` |
| EXP-A (κ) | Resonancia provisional **solo** con log de acceso e instrumento ciego; exportación `.json` (`liveReport` + `editedAnnotations`) para auditoría externa | `GET /api/independent-eval` · `POST /api/independent-eval/score` |

κ ≈ 0.6871 es registro histórico sobre `datasets/independent_eval/annotations.json`. Sin `ACCESS_LOG` de exposición previa **no** se declara «demostración provisional completada» en esta auditoría. La pestaña interactiva permite descargar el estado vigente en `.json` (`iom-independent-eval-audit/v1`) para verificación externa reproducible.

## 4. Diagnóstico sintético (circular)

| Método | Accuracy |
|--------|---------:|
| PI-HGAT-T (fase + posición) | 1.0000 |
| MLP / reglas sin grafo | 1.0000 |

Muestran que la regla ya se halla embebida en las *features*; se conservan como referencia metodológica y no constituyen validez semántica mundana.

## 5. Referencias

- Técnica: [`docs/AUDITORIA_TECNICA.md`](docs/AUDITORIA_TECNICA.md)
- Métricas sintéticas: [`docs/AUDITORIA_METRICAS.md`](docs/AUDITORIA_METRICAS.md)
- TCAAU y teseractos `{4,3,3}`: [`docs/TCAAU.md`](docs/TCAAU.md) · [`docs/TCAAU_RECONSTRUCCION_ACADEMICA.md`](docs/TCAAU_RECONSTRUCCION_ACADEMICA.md)
