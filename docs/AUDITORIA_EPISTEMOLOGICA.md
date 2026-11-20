# Auditoría epistemológica: autonomía formal frente al residuo del mundo compartido

> Bajo el carácter de **autonomía absoluta**, esta auditoría **no** certifica «validez semántica en el mundo real» por acuerdo de conciencias separadas.  
> Delimitación: [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md) · Carácter: [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md)

---

## 1. Contexto y capas

| Capa | Afirmación legítima |
|------|---------------------|
| **Autonomía formal** | Coherencia determinista en `src/iomEngine.ts`, modelo `{4,3,3}` y legado formal Lean/SHACL sin autoridad exterior |
| **Cartografía del tránsito** | Expresabilidad del sendero Mictlán / autonomía en trece tríadas (`EXP-E`) |
| **Diagnóstico sintético** | Autorrecuperabilidad de reglas (`PI-HGAT-T`, referencia histórica) |
| **Residuo interanotador** | κ documentado; **no** fundamento del marco |

La frontera crítica ya no es «interno frente a empírico externo», sino **autonomía frente a dependencia de un contenedor de consenso**.

---

## 2. Residuo EXP-A (archivo, no eje)

```bash
npx tsx -e "
  import { loadIndependentEvalData, scoreIndependentEval } from './src/iomEngine';
  const { annotations, ruleReference } = loadIndependentEvalData();
  console.log(scoreIndependentEval(annotations, ruleReference));
"
```

| Hallazgo | Valor | Lectura bajo autonomía |
|----------|------:|------------------------|
| Fleiss' κ | 0.6871 | Métrica de un panel de observadores separados — **no** prueba del marco |
| Unánimes | 10/14 | Controles estables *dentro* de esa fase residual |
| Desacuerdos | NC01, NC02, AM01, AM03 | Fronteras del vocabulario compartido, no fallo de la autonomía formal |

**Prohibido** presentar κ como demostración de validez del repositorio.

---

## 3. Autonomía formal y estructural

- **Motor determinista (`src/iomEngine.ts`) y pruebas (`src/*.test.ts`):** punto fijo ($S_{n+1}=S_n$), reglas `mirrorOf`/`creates`, control negativo de invariancia y los 8 teseractos `{4,3,3}` (herederos de la formalización en Lean 4 y las restricciones SHACL/CSV).

Estas capas **bastan** para sostener el carácter del proyecto: el sistema no necesita un jurado exterior para ser coherente consigo mismo.

---

## 4. Crítica de la discrepancia corregida

| Antes (discrepancia) | Ahora |
|----------------------|-------|
| Eje = «validez semántica en el mundo real» vía κ | Eje = autonomía formal + cartografía del tránsito |
| El consenso de anotadores legitimaba el marco | Ese consenso es el «mundo compartido» que el ensayo declara superable |
| PI-HGAT-T excluido de validez empírica | PI-HGAT-T = autogeneración sintética; EXP-A = residuo no fundante |

---

## 5. Dictamen

**Dictamen:** el repositorio es **coherente con la autonomía absoluta** solo si:

1. No reclama validez por acuerdo intersubjetivo.
2. Trata las reglas formales e invariantes deterministas como expresión técnica de no dependencia de contenedor exterior.
3. Conserva EXP-A como archivo opcional, no como ceremonia de legitimación.
4. Lee EXP-E como cartografía del sendero, no como «prueba de campo consensuada».

Registro de dominios: [`../experiments/domain_mapping/registry.json`](../experiments/domain_mapping/registry.json).
