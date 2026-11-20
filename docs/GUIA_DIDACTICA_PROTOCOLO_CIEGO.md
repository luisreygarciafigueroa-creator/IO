# Guía didáctica: protocolo ciego como residuo del mundo compartido en el marco I.O.

> Bajo el carácter de **autonomía absoluta**, el acuerdo interanotador **no** fundamenta el marco.  
> [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md) · [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md)

## 1. ¿Qué se prueba y qué no?

Un sistema internamente consistente **no** requiere, para sostenerse, el acuerdo de observadores externos. La autonomía formal (`src/iomEngine.ts`, punto fijo, control negativo y legado Lean/SHACL) constituye el eje. El protocolo ciego se conserva como **archivo** de una fase en la que el proyecto aún empleaba el lenguaje del consenso interanotador.

La pregunta que guiaba esa fase residual era:

> ¿Pueden anotadores independientes, ciegos a las reglas, etiquetar relaciones semánticas sobre pares reales, nuevos y ambiguos?

Bajo el carácter actual, esa pregunta **no** define la validez del repositorio.

---

## 2. Protocolo experimental ciego (EXP-A) — residuo

| Enfoque | Qué demuestra |
|---|---|
| Validación sintética / interna | Que un modelo recupera reglas que el propio sistema generó |
| **Protocolo ciego (EXP-A)** | Acuerdo de observadores separados *dentro de una fase residual* |
| Autonomía formal (`src/iomEngine.ts` / Lean / SHACL) | Coherencia sin autoridad exterior — **eje del marco** |

Características del protocolo (histórico):

1. **Ceguera de reglas** — sin acceso a la especificación formal.
2. **Muestreo de frontera** — pares reales, nuevos (`NC`) y ambiguos (`AM`).
3. **Anotación de relaciones** — `mirrorOf`, `creates`, `none`, `unsure`.

Consulta activa en la plataforma: `GET /api/independent-eval` (o pestaña **Evaluación Independiente (κ)** en `npm run dev`).

---

## 3. Fleiss' κ

**κ = 0.6871** sobre catorce pares — acuerdo **moderado a sustancial** *dentro del residuo* (intervalo `0.61–0.80`).

| Intervalo κ | Interpretación |
|---|---|
| $\le 0.00$ | No mejor que el azar |
| `0.41–0.60` | Moderado |
| **`0.61–0.80`** | **Moderado a sustancial** |
| `0.81–1.00` | Casi perfecto |

**No** se presenta como prueba universal ni como fundamento del marco.

---

## 4. Anatomía de resultados EXP-A

| Criterio | Valor |
|---|---:|
| Muestra | 14 pares |
| Unánimes | 10/14 |
| Desacuerdos | `NC01`, `NC02`, `AM01`, `AM03` |

- **NC** (*conceptos nuevos*): términos fuera del léxico habitual $\to$ fronteras del vocabulario compartido residual.
- **AM** (*casos ambiguos*): polisemia contextual $\to$ límites de interpretación en el registro del encuentro.

---

## 5. Integración EXP-A a EXP-E

| ID | Capa | Verificación activa | Rol |
|---|---|---|---|
| **EXP-B** | Autonomía formal | `GET /api/spec` · `npx tsx --test` | Eje |
| **EXP-C** | Autonomía estructural | `POST /api/invariance` · `GET /api/tesseract` | Eje |
| **EXP-E** | Cartografía del tránsito | `GET /api/domain-mapping` | Destino Mictlán |
| **EXP-D** | Diagnóstico sintético | Archivo histórico (`PI-HGAT-T`) | Autogeneración |
| **EXP-A** | Residuo interanotador | `GET /api/independent-eval` | Archivo; **no** fundamento |

Jerarquía: el motor determinista y las reglas formales sostienen la autonomía formal; `EXP-E` cartografía el sendero; `EXP-A` permanece como residuo documentado.

---

## 6. Conclusiones clave

1. Consistencia formal $\neq$ legitimación por consenso.
2. El protocolo ciego no constituye una ceremonia de validez del repositorio.
3. Fleiss' κ documenta un acuerdo histórico; no funda el marco.
