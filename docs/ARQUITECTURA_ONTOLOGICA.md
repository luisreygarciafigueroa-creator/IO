# Propuesta de arquitectura ontológica: marco semántico I.O. para la alineación de dominios empíricos

> Arquitectura de alineación interdisciplinaria (cosmología náhuatl) sobre las cinco perspectivas, trece tríadas y el modelo `{4,3,3}`.  
> Premisas: [`PREMISAS_Y_TEOREMAS.md`](PREMISAS_Y_TEOREMAS.md) · Relaciones: [`RELACIONES_OPERATIVAS.md`](RELACIONES_OPERATIVAS.md) · Catálogo: [`CATALOGO_DOMINIOS.md`](CATALOGO_DOMINIOS.md)

---

## 1. Fundamentos y relaciones operativas

Principios base: vacío, unidad, infinito y transformación.

| Perspectiva | Rol arquitectónico |
|---|---|
| Individualidad | Unidad base e identidad primaria |
| Dualidad | Polaridad y tensión binaria |
| Totalidad | Integración sistémica |
| Evolución | Complejización y emergencia |
| Involución | Reabsorción y retorno |

- **`mirrorOf`:** isomorfismo estructural y simetría de roles en fases opuestas (`pos' = 2 - pos`).
- **`creates`:** generación orientada y transición entre fases opuestas (`lateral ↔ centro`).

## 2. Estratificación multicapa

| Capa | Función |
|---|---|
| Autonomía formal | Núcleo determinista en `src/iomEngine.ts` (reglas heredadas de Lean 4), `data/iom_spec.json` |
| Estructural y geométrica | Partición `390`, `78` nodos y teseractos `{4,3,3}` (`src/tesseractFlowGraph.ts`, legado OWL/SHACL) |
| Cartografía del tránsito | Alinear el destino Mictlán (`EXP-E`, `/api/domain-mapping`) |
| Diagnóstico sintético | Calibración interna histórica (`PI-HGAT-T`; no fundamenta validez mundana) |
| Residuo interanotador | Registro comparado opcional (`EXP-A`, Fleiss' κ; no fundamenta el marco) |

## 3. Alineación con la cosmología náhuatl

Procedimiento de seis pasos: fenómeno → perspectiva → tríada → fase → `mirrorOf` / `creates` → comprobación estructural contra `data/iom_spec.json` (`GET /api/domain-mapping`).

### Matriz comparativa (EXP-E — cosmología náhuatl)

| Perspectiva | Cosmología náhuatl | Operación |
|---|---|---|
| Individualidad | Tezcatlipoca / Quetzalcóatl (fuerzas polares) | `mirrorOf` |
| Dualidad | Vida ↔ muerte; tensión de opuestos | `mirrorOf` |
| Totalidad | *Nahui Ollin* (Quinto Sol) | Integración de la edad presente |
| Evolución | Sucesión de Soles / nuevo ciclo | `creates` (emergencia) |
| Involución | Camino al Mictlán / cataclismo | `creates` (retorno al vacío) |

Ejemplos ejecutables: [`experiments/domain_mapping/examples.json`](../experiments/domain_mapping/examples.json).

## 4. Evaluación interanotador residual

Fleiss' $\kappa = \mathbf{0.6871}$ (catorce pares, 10/14 unánimes; desacuerdos en `NC01`, `NC02`, `AM01`, `AM03`). Constituye un archivo histórico de interpretabilidad residual, no el fundamento del marco.

## 5. Flujo operativo y gobernanza

```bash
npm install
npm run lint
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts
npm run build
npm run dev
```

Mapa documental: [`TCAAU.md`](TCAAU.md), [`TCAAU_RECONSTRUCCION_ACADEMICA.md`](TCAAU_RECONSTRUCCION_ACADEMICA.md), [`VALIDACION_INDEPENDIENTE.md`](VALIDACION_INDEPENDIENTE.md), [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md), [`CATALOGO_DOMINIOS.md`](CATALOGO_DOMINIOS.md), [`PREMISAS_Y_TEOREMAS.md`](PREMISAS_Y_TEOREMAS.md), [`RELACIONES_OPERATIVAS.md`](RELACIONES_OPERATIVAS.md), [`ESPECIFICACION_METODOLOGICA.md`](ESPECIFICACION_METODOLOGICA.md), [`AUDITORIA_EPISTEMOLOGICA.md`](AUDITORIA_EPISTEMOLOGICA.md), `paper.md`, `EXPERIMENTOS.md`, `AUDITORIA.md`, `REPRODUCCION.md`, `MANIFEST.sha256`.
