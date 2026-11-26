# Evaluación independiente (resonancia provisional — EXP-A)

> **Fundamento teórico:** **TCAAU** — [`Teor_a_Completa_TCAAU__2__ee97e4df.pdf`](../../public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf) · [`docs/TCAAU.md`](../../docs/TCAAU.md) · [`data/tcaau_core.json`](../../data/tcaau_core.json). Por el criterio de autonomía absoluta (`A1`, `D11`, `R7`), el único control legítimo del núcleo es el reconteo determinista desde dentro (`I6`, `§11.3–§11.4`); el protocolo κ integra la tercera condición del criterio de clausura y la concordancia no funda el marco por sí sola.

**Estado histórico: completado** (κ = 0.6871).  
Bajo el carácter actual del repo, este conjunto es un **registro del encuentro**
con observadores separados, **no** el fundamento del marco.

## Ceguera = estado del anotador

El repo público documenta autonomía; un anotador que lo lea antes de anotar
queda contaminado. Por eso las rondas nuevas usan el **instrumento autocontenido**:

```
instrument/
  INSTRUCTIONS.md   # definiciones neutras
  pairs.csv         # 14 pares sin gold
  ACCESS_LOG.template.json
```

Entregar **solo** instrucciones + pares, fuera del clon del repo.  
Registrar en el log de acceso **cuándo** se entregó qué y si hubo exposición previa.

## Integridad

| Archivo | Rol |
|---------|-----|
| `instrument/` | Material entregable al anotador (ceguera práctica) |
| `annotator_pairs.csv` | Misma lista de pares (análisis en-repo) |
| `annotations.json` | Juicios A1–A3 (histórico) |
| `rule_reference.json` | Solo post-hoc |
| `PROTOCOL.json` | Protocolo + reglas de independencia |

## Resultados históricos

| Métrica | Valor |
|---------|------:|
| Fleiss' κ | 0.6871 |
| Unánime | 10/14 |
| Desacuerdos | NC01, NC02, AM01, AM03 |

```bash
python scripts/score_independent_eval.py --annotations datasets/independent_eval/annotations.json
```

## Lenguaje

Autoriza hablar de **resonancia inter-subjetiva provisional** bajo protocolo ciego.  
**No** autoriza «el marco es válido porque κ ≈ 0.69».
