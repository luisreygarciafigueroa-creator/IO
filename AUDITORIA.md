# Auditoría IOM — autofundamentación y encuentros

**Jerarquía canónica:** [`EXPERIMENTOS.md`](EXPERIMENTOS.md) · [`REPRODUCCION.md`](REPRODUCCION.md)  
**Delimitación:** [`docs/DELIMITACION_EPISTEMOLOGICA.md`](docs/DELIMITACION_EPISTEMOLOGICA.md)  
**Cosmología:** [`docs/COSMOLOGIA_DEL_MICTLAN.md`](docs/COSMOLOGIA_DEL_MICTLAN.md)

## 1. Capa primaria — autonomía (punto fijo e invariantes)

El repositorio es **válido como sistema** si, y solo si:

1. `npm run lint` (`tsc --noEmit`) y `npm run build` compilan sin errores.
2. `npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts` aprueba todas las pruebas deterministas (reglas formales, ocho teseractos `{4,3,3}`, grafo D3 y exportación de auditoría `.json`).
3. `GET /api/spec` y `POST /api/invariance` regeneran en dos pasadas idénticas los **78** nodos, **20** pasos vectoriales y **390** candidatos (`78 mirrorOf + 104 creates + 208 none`) con identidad SHA-256 ($S_{n+1}=S_n$).
4. `POST /api/invariance` reporta invariancia **no trivial** con detección obligatoria de corrupción (`detects_corruption = true`).
5. `GET /api/tesseract` verifica las 16 transiciones sobre los 7 conceptos (`universo, materia, vacio, internet, cuerpo, IA, mictlan`) con `allRealUseRightArrow = true`, `allHaveOneRealOneVirtual = true` y `allCubeLinesMatchHeader = true`.

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
