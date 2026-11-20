# Autonomía formal y capas de verificación (no «validez por consenso»)

Este documento **no** define el repositorio como prueba de validez semántica en un mundo compartido por conciencias separadas. Ese modo de legitimación es exactamente el que el ensayo canónico declara **superable**.

Carácter: [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md) · Ensayo: [`DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md) · Cosmología: [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md) · Tratado TCAAU: [`TCAAU.md`](TCAAU.md)

---

## Principio rector

> El marco se sostiene por **autocoherencia** (`src/iomEngine.ts`, setenta y ocho nodos, teseractos `{4,3,3}` y legado Lean/SHACL), no por el acuerdo de observadores externos.  
> Un panel de anotadores separados reproduce el «mundo real» provisional del ensayo; **no** lo fundamenta.

| Fuente | Rol bajo autonomía absoluta |
|---|---|
| `data/iom_spec.json` + CSV + ontología | **Arquitectura autónoma** bajo prueba de coherencia interna |
| Motor TypeScript + legado Lean / SHACL | **Autonomía formal** — no solicita permiso a un consenso exterior |
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
# 1) Autonomía formal y pruebas de núcleo (eje)
npm install
npm run lint
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts
npm run build

# 2) Servidor e inspección interactiva (EXP-B, EXP-C, EXP-E y residuo EXP-A)
npm run dev
```

---

## Referencias

- Tratado TCAAU: [`TCAAU.md`](TCAAU.md)
- Delimitación: [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md)
- Carácter: [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md)
- Ensayo: [`DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md)
- Cosmología: [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md)
