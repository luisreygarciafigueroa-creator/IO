# Autonomía formal y reconteo ejecutable desde dentro ($I6$)

Este documento **no** define el repositorio como prueba de validez semántica en un mundo compartido por conciencias separadas. Conforme a la proposición $I6$ de la TCAAU, el único control legítimo de una teoría sin exterior es el reconteo ejecutable y reproducible desde dentro.

Texto canónico (PDF): [`Teor_a_completa_TCAAU__3__1390bf98.pdf`](../public/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf) · Núcleo legible por máquina: [`../data/tcaau_core.json`](../data/tcaau_core.json) · Carácter: [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md) · Tratado TCAAU: [`TCAAU.md`](TCAAU.md)

---

## Principio rector

> El marco se sostiene por **reconteo ejecutable y autocoherencia** (`src/iomEngine.ts`, `src/tcaauCore.ts`, `78` nodos, `390` candidatos, `39` pares `mirrorOf`, teseractos `{4,3,3}` y legado Lean/SHACL), no por el acuerdo de observadores externos.  
> Un panel de anotadores separados pertenece al residuo histórico del «mundo compartido»; **no** lo fundamenta.

| Fuente | Rol bajo autonomía absoluta ($D11$, $R7$) |
|---|---|
| `data/iom_spec.json` + `data/tcaau_core.json` + ontología | **Arquitectura autónoma** sujeta a reconteo determinista |
| Motor TypeScript (`iomEngine` / `tcaauCore`) + legado Lean / SHACL | **Autonomía formal** — no solicita permiso a un consenso exterior |
| `PI-HGAT-T` / líneas base (histórico) | Autorrecuperabilidad de reglas *del propio sistema* |
| `datasets/independent_eval/` | **Residuo** de la fase de conciencias separadas (documentado, no fundante) |
| Cartografía de dominios | Ejercicio del tránsito; no certificado de «mundo real» |

---

## Qué se establece y qué no

| Se establece | No se establece |
|---|---|
| Coherencia deductiva, punto fijo y de forma en trece tríadas y `{4,3,3}` | Que el marco «describe la realidad» por acuerdo intersubjetivo |
| Que las reglas son recuperables desde sí mismas (diagnóstico interno) | Que $\kappa \approx 0.69$ **funda** la validez del proyecto |
| Que el sendero Mictlán / autonomía es cartografiable en el vocabulario formal | Cobertura empírica universal mediante paneles externos |
| Que el requisito del sistema puede ser la abolición de requisitos impuestos | Verdad ontológica universal por consenso |

---

## Jerarquía de afirmaciones

| Prioridad | Afirmación legítima | Artefacto |
|:---------:|---|---|
| **1** | Autonomía formal (coherencia sin contenedor exterior) | `src/iomEngine.ts`, `data/iom_spec.json`, `src/*.test.ts` (legado Lean/SHACL) |
| **2** | Cartografía del tránsito (Mictlán / autonomía) | `EXP-E`, `/api/domain-mapping`, ensayo, Cosmología, TCAAU |
| **3** | Autogeneración recuperable de reglas | Diagnóstico sintético (`PI-HGAT-T`, registro histórico) |
| **4** | Residuo documentado del mundo compartido | `datasets/independent_eval/`, `/api/independent-eval` (opcional) |

La prioridad 4 **no** se promociona a «prueba de validez del marco».

---

## Sobre el protocolo ciego (EXP-A)

El protocolo y las anotaciones se **conservan como archivo** de una fase en la que el proyecto aún hablaba el lenguaje del consenso interanotador. Bajo el carácter actual:

- κ no es el eje del repositorio.
- No se reclama «validez semántica en el mundo real» a partir de él.
- Quien lo ejecute lo hace como **ejercicio histórico o comparado**, nunca como ceremonia de legitimación.

---

## Flujo prioritario (Node.js 22 + TypeScript)

```bash
# 1) Autonomía formal y reconteo ejecutable (eje)
npm install
npm run lint
npx tsx --test src/iomEngine.test.ts src/tcaauCore.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts
npm run build

# 2) Servidor e inspección interactiva (EXP-B, EXP-C, TCAAU Core, EXP-E y residuo EXP-A)
npm run dev
```

---

## Referencias

- Texto canónico TCAAU (PDF): [`Teor_a_completa_TCAAU__3__1390bf98.pdf`](../public/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf)
- Núcleo legible por máquina: [`data/tcaau_core.json`](../data/tcaau_core.json) (`src/tcaauCore.ts`)
- Tratado TCAAU: [`TCAAU.md`](TCAAU.md) · [`TCAAU_RECONSTRUCCION_ACADEMICA.md`](TCAAU_RECONSTRUCCION_ACADEMICA.md)
- Delimitación y carácter: [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md) · [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md)
- Ensayo y cosmología: [`DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md) · [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md)
