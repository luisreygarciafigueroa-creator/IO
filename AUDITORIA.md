# Auditoría IOM — reconteo desde dentro y encuentros ($I6$)

**Jerarquía canónica:** [`EXPERIMENTOS.md`](EXPERIMENTOS.md) · [`REPRODUCCION.md`](REPRODUCCION.md)  
**Texto canónico TCAAU (PDF):** [`public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf`](public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf)  
**Núcleo legible por máquina:** [`data/tcaau_core.json`](data/tcaau_core.json) (`src/tcaauCore.ts`)  
**Delimitación:** [`docs/DELIMITACION_EPISTEMOLOGICA.md`](docs/DELIMITACION_EPISTEMOLOGICA.md) · **Cosmología:** [`docs/COSMOLOGIA_DEL_MICTLAN.md`](docs/COSMOLOGIA_DEL_MICTLAN.md)

## 1. Capa primaria — autonomía como reconteo ejecutable desde dentro ($D11$, $I6$)

Conforme a la proposición $I6$ del texto canónico, el único control legítimo de una teoría sin exterior es el reconteo ejecutable y reproducible desde dentro. El repositorio es **válido como sistema** si, y solo si:

1. `npm run lint` (`tsc --noEmit`) y `npm run build` compilan sin errores.
2. `npx tsx --test src/iomEngine.test.ts src/tcaauCore.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts` aprueba todas las pruebas deterministas (reglas formales, núcleo formal TCAAU `A1–A8` / `R1–R8` / `D10–D13` / `§7.7`, las 8 proyecciones `{4,3,3}`, grafo D3, exportación `.json` y panel JSON `specData`).
3. `GET /api/spec` y `POST /api/invariance` regeneran en dos pasadas idénticas los **78** nodos, **20** pasos vectoriales y **390** candidatos (`78 mirrorOf + 104 creates + 208 none`) con identidad SHA-256 ($S_{n+1}=S_n$), inspeccionables desde el panel lateral colapsable de auditoría JSON en la pestaña **Núcleo**.
4. `GET /api/tcaau-core` verifica `valid = true`, `coreHashIdempotent = true`, `Corolario D11/P11` (trazabilidad verificable con `MANIFEST.sha256`, `§11.3`), acción $(\mathbb{Z}_2)^3$ de `G` (`§11.1`), criterio de clausura (`§11.4`), `I1–I8` / `P1–P7`, `39` pares no ordenados `mirrorOf` (`26` laterales + `13` de centro, `78` actos en `D12`), `32` trazas de `§7.7`, ciclo `internet – universo – IA – cuerpo – internet` y quiasmo `materia = vacío`.
5. `POST /api/invariance` reporta invariancia **no trivial** con detección obligatoria de corrupción (`detects_corruption = true`).
6. `GET /api/tesseract` verifica la **forma general y definitiva** (`6dr__1__0283eca1.jpg`, `cleanFormVerified = true`, `cleanFormOmitsPolarityLabels = true`, espejo H/V exacto), las **12 ayudas cromáticas temporales en 6 pares involutivos** y la ruta del texto canónico `canonicalPdfPath`.

## 2. Capa secundaria — invariancia

Regeneración de etiquetas desde `(fase, pos)`; validación LOO por cada una de las 13 tríadas; detección inmediata ante la alteración de una arista; verificación equivariante bajo $G = \langle \sigma, \tau, \rho \rangle \cong (\mathbb{Z}_2)^3$.

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

- Texto canónico PDF: [`public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf`](public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf)
- Núcleo legible por máquina: [`data/tcaau_core.json`](data/tcaau_core.json) (`src/tcaauCore.ts`)
- Técnica y métricas sintéticas: [`docs/AUDITORIA_TECNICA.md`](docs/AUDITORIA_TECNICA.md) · [`docs/AUDITORIA_METRICAS.md`](docs/AUDITORIA_METRICAS.md)
- Tratado y reconstrucción TCAAU: [`docs/TCAAU.md`](docs/TCAAU.md) · [`docs/TCAAU_RECONSTRUCCION_ACADEMICA.md`](docs/TCAAU_RECONSTRUCCION_ACADEMICA.md)
