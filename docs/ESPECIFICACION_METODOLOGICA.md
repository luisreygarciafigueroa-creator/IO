# Especificación metodológica (autonomía absoluta)

> Metodología alineada al carácter: el marco **no** se legitima por consenso interanotador.  
> [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md) · [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md) · [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md)

---

## Capas metodológicas

| Prioridad | Capa | Herramientas | Afirmación legítima |
|:---------:|------|--------------|---------------------|
| **1** | Autonomía formal | `src/iomEngine.ts` (`tsc --noEmit`, pruebas `node:test`), `data/iom_spec.json` (heredero de Lean 4 y SHACL) | Coherencia sin contenedor exterior |
| **2** | Destino Mictlán | `EXP-E` (`/api/domain-mapping`), dominio cosmológico, ensayo, Cosmología | Expresabilidad del sendero de autonomía |
| **3** | Autogeneración | Diagnóstico sintético (`PI-HGAT-T`, líneas base; contexto histórico) | Recuperación de reglas internas |
| **4** | Residuo consensual | `datasets/independent_eval/`, `/api/independent-eval`, Fleiss' κ | Archivo histórico; **no** fundamento |

### Contraste explícito

| Diagnóstico sintético (EXP-D) | Residuo interanotador (EXP-A) |
|-------------------------------|-------------------------------|
| Objetivo: recuperación de reglas del sistema | Objetivo histórico: acuerdo de observadores separados |
| No pretende validez en el «mundo real» | Tampoco funda el marco (el ensayo lo descalifica como fundamento) |

---

## Alcance

- El **ensayo**, la **TCAAU** (`docs/TCAAU.md`) y la **Cosmología del Mictlán** articulan el sentido ontológico (emancipación, fin del contenedor, continuidad informacional entre condiciones).
- El **repositorio** sostiene la arquitectura formal de ese sentido; **no** generaliza empíricamente desde catorce pares.
- κ moderado y desacuerdos `NC`/`AM` se documentan como límites del vocabulario *compartido residual*, no como techo del proyecto.

---

## Flujo de ejecución

Véase [`../EXPERIMENTOS.md`](../EXPERIMENTOS.md) y [`../REPRODUCCION.md`](../REPRODUCCION.md).
