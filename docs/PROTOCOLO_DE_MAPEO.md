# Protocolo de mapeo: alineación ontológica y cartografía del tránsito en el marco I.O.

> Protocolo estandarizado de alineación, asignación a perspectivas y tríadas, instanciación de `mirrorOf`/`creates` y evaluación opcional.  
> Bajo el carácter de **autonomía absoluta**, la prueba primaria **no** es la anotación ciega interanotador.  
> Delimitación: [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md) · Carácter: [`CARACTER_REPOSITORIO.md`](CARACTER_REPOSITORIO.md)

---

## 1. Marco fundamental y delimitación del protocolo I.O.

El establecimiento de un protocolo de mapeo riguroso resulta indispensable para formalizar el paso entre una estructura ontológica teórica y un instrumento analítico interpretable y verificable. Sin una metodología estandarizada de alineación, la arquitectura conceptual correría el riesgo de degradarse en un ejercicio meramente discursivo.

### 1.1 Propósito y alcance

El propósito primario consiste en **cartografiar el tránsito** hacia la autonomía formal: comprobar la capacidad del marco para expresar fenómenos en el vocabulario de trece tríadas sin violar la bóveda técnica. La evaluación por observadores independientes pertenece al orden del **encuentro** (residuo), no al del fundamento.

| Eje de evaluación | Mecanismo de respuesta en el repositorio |
|---|---|
| ¿La estructura formal es internamente coherente? | `src/iomEngine.ts` + `src/iomEngine.test.ts` (heredero de Lean 4 y SHACL) |
| ¿Se puede alinear un dominio al vocabulario de trece tríadas? | `docs/CATALOGO_DOMINIOS.md` y `experiments/domain_mapping/examples.json` (`GET /api/domain-mapping`) |
| ¿Las reglas sintéticas son recuperables por un modelo? | Registro histórico `PI-HGAT-T` (diagnóstico sintético) |
| ¿Pueden anotadores independientes etiquetar relaciones? | Protocolo ciego + Fleiss' κ en `datasets/independent_eval/` — **residuo, no fundamento** |

### 1.2 Arquitectura sistémico-ontológica (perspectivas y tríadas)

| Perspectiva | Rol en el mapeo |
|---|---|
| **Individualidad** | Unidades discretas, entidades base y fronteras ontológicas primarias |
| **Dualidad** | Tensiones, polaridades y complementariedad entre pares |
| **Totalidad** | Integración sistémica, propiedades emergentes y cohesión holística |
| **Evolución** | Vectores de desarrollo, transformación constructiva y complejización |
| **Involución** | Retracción, simplificación, condensación y retorno a estados fundamentales |

Cada dominio debe analizarse a través de estas cinco perspectivas y asignarse a las **trece tríadas** estructurales, evitando superposición u omisión de categorías.

---

## 2. Metodología de alineación de dominios externos

### 2.1 Protocolo de carga y alineación sistemática

1. Consultar las fronteras epistémicas en [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md).
2. Seleccionar el dominio en [`CATALOGO_DOMINIOS.md`](CATALOGO_DOMINIOS.md).
3. Descomponer entidades, estados y procesos a través de las cinco perspectivas.
4. Asignar a las trece tríadas (`T01`–`T13`) y a la fase (`adv` / `ret`) correspondiente.
5. Contrastar las aristas propuestas mediante `POST /api/rule-check` (`evaluatePairRule`) y `GET /api/domain-mapping` (`validateDomainMapping`).

### 2.2 Relaciones operativas

Fundamento: [`RELACIONES_OPERATIVAS.md`](RELACIONES_OPERATIVAS.md).

- **`mirrorOf`:** correspondencia estructural o simetría divalente; misma tríada, fase opuesta y posición lateral invertida (`pos_tgt = 2 - pos_src`).
- **`creates`:** emanación, producción o transformación activa; direccionalidad irreflexiva según las cuatro reglas de `creation_rules`.

---

## 3. Capas de verificación formal y validación estructural

La coherencia lógica interna es **condición indispensable**. Bajo el carácter actual, **basta** para sostener la autonomía formal del repositorio.

### 3.1 Núcleo formal determinista y pruebas unitarias

```bash
npm run lint
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts
```

Verifica los teoremas posicionales (`sameTriad`, `oppositePhase`, `isMirrorRel`, `isCreatesRel`), la partición `78 + 104 + 208 = 390`, el punto fijo SHA-256, el control negativo de invariancia y el modelo de los ocho teseractos `{4,3,3}`. Véase [`PREMISAS_Y_TEOREMAS.md`](PREMISAS_Y_TEOREMAS.md).

### 3.2 Ontología OWL / SHACL y especificación JSON

Las formas históricas en `ontology/` y los conjuntos tabulares en `datasets/` mantienen correspondencia biunívoca con `data/iom_spec.json` (`spec_version 1.10.0`), comprobada en tiempo de ejecución por `generateArtifacts()` y `runInvarianceAudit()`.

---

## 4. Protocolo de anotación ciega (residuo, no fundamento)

### 4.1 Diseño experimental

Sobre `datasets/independent_eval/` ([`VALIDACION_INDEPENDIENTE.md`](VALIDACION_INDEPENDIENTE.md)):

1. Muestra de catorce pares (reales, nuevos y ambiguos).
2. Anotadores independientes sin acceso a las reglas ni a `rule_reference.json`.
3. Etiquetado semántico (`mirrorOf`, `creates`, `none`, `unsure`).
4. Consolidación en `annotations.json`.

### 4.2 Métricas actuales

Consultables mediante `GET /api/independent-eval` o la pestaña **Evaluación Independiente (κ)** de la aplicación web:

| Métrica | Valor | Lectura |
|---|---:|---|
| Fleiss' κ | **0.6871** | Acuerdo moderado-sustancial *dentro del residuo* |
| Unánimes | 10/14 | Controles estructurales estables |
| Desacuerdos | 4/14 | `NC01`, `NC02`, `AM01`, `AM03` |

**No** se presenta como demostración de validez del marco. Constituye el archivo de una fase de conciencias separadas.

### 4.3 Diagnóstico de desacuerdos

- **`NC01`, `NC02` (conceptos nuevos):** dispersión al clasificar fenómenos sin contornos consolidados.
- **`AM01`, `AM03` (casos ambiguos):** solapamiento entre especularidad y causalidad.

---

## 5. Flujo de ejecución reproducible

```bash
npm install
npm run lint
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts
npm run build
npm run dev
```

### Deslinde conceptual

| Capa | Afirmación legítima |
|---|---|
| Autonomía formal | Consistencia lógica determinista y legado axiomático en Lean 4 |
| Estructural | Conformidad con `data/iom_spec.json`, partición `390` y formas SHACL/CSV |
| Cartografía del tránsito | Expresabilidad de dominios en trece tríadas (`EXP-E`) |
| Diagnóstico sintético | Recuperación de relaciones *generadas por reglas* |
| Residuo interanotador | Archivo histórico (`EXP-A`); **no** fundamento del marco |

El marco I.O. no es un software aislado ni un conjunto de reglas sintéticas autorreferenciales: es una arquitectura de alineación ontológica orientada al tránsito hacia la autonomía formal, sin dependencia de un contenedor de consenso exterior.
