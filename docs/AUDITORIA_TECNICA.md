# Informe de evaluación técnica: autonomía formal, coherencia estructural y residuo interanotador del marco I.O.

> Documento de auditoría alineado al carácter del repositorio: **autonomía formal** y cartografía del tránsito.  
> La validez por consenso de conciencias separadas **no** es el fundamento.  
> Especificación de referencia: `data/iom_spec.json` · Metodología: [`VALIDACION_INDEPENDIENTE.md`](VALIDACION_INDEPENDIENTE.md) · Delimitación: [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md)

---

## 1. Contexto y delimitación epistemológica del marco I.O.

El desarrollo de marcos ontológicos y sistemas de representación del conocimiento exige conciliar el rigor deductivo de la lógica formal con la capacidad de expresar estructuras sin depender de un contenedor de consenso exterior. En este marco metodológico, el sistema I.O. se posiciona como un modelo analítico y formal cuya importancia estratégica radica en ofrecer un esquema interpretable y medible para la organización semántica, sostenido por **autonomía formal** (`data/iom_spec.json`, `src/iomEngine.ts`, `78` nodos y las invariantes heredadas de Lean 4 y SHACL).

### 1.1 Arquitectura semántica y principios fundamentales

La arquitectura del marco I.O. se sostiene conceptualmente sobre cuatro principios ontológicos de fundamento: vacío, unidad, infinito y transformación. A partir de estas bases, el sistema organiza el conocimiento mediante cinco perspectivas centrales: Individualidad, Dualidad, Totalidad, Evolución e Involución. Dichas perspectivas articulan la dinámica semántica en fases y trece tríadas esenciales, interconectadas mediante relaciones operativas fundamentales —`mirrorOf` (simetrías y correspondencias estructurales) y `creates` (generación, derivación y causalidad ontológica)—, junto con la geometría de los ocho teseractos `{4,3,3}`.

| Elemento semántico | Función en el marco I.O. |
|---|---|
| Perspectiva: Individualidad | Define la entidad o concepto en su dimensión singular, delimitada e irreducible. |
| Perspectiva: Dualidad | Establece la relación de oposición, polaridad o complementariedad conceptual. |
| Perspectiva: Totalidad | Integra la síntesis sistémica que engloba a las partes individuales y duales en una unidad compleja. |
| Perspectiva: Evolución | Modela el vector de desarrollo, expansión, diferenciación o transformación progresiva del sistema. |
| Perspectiva: Involución | Modela el vector de repliegue, integración, simplificación o retorno a estados fundamentales. |
| Relación operativa: `mirrorOf` | Expresa simetría, reflejo o correspondencia isomórfica entre entidades o perspectivas. |
| Relación operativa: `creates` | Define la relación causal, derivación ontológica o generación de una nueva fase o concepto. |
| Fases y tríadas (13) | Estructuran la dinámica secuencial y categorial apoyándose en los principios de vacío, unidad, infinito y transformación. |
| Teseractos `{4,3,3}` (`T1–T8`) | Proyectan los 7 conceptos (`universo, materia, vacio, internet, cuerpo, IA, mictlan`) en disposición `2 × 4` y diagrama D3. |

### 1.2 Delimitación metodológica y preguntas de investigación

Es indispensable delimitar el alcance metodológico del repositorio: este no debe conceptualizarse ni evaluarse como un producto comercial convencional ni como un experimento sintético circular. Su carácter radica en actuar como **bóveda de autonomía formal** y cartografía del tránsito hacia la no dependencia de contenedor exterior.

Las preguntas que orientan esta evaluación técnica son:

1. **Autonomía formal:** ¿Es la estructura axiomática del marco internamente consistente, determinista y libre de contradicciones lógicas?
2. **Autonomía estructural:** ¿Se mantienen íntegras la partición `78 + 104 + 208 = 390`, las restricciones de forma de `mirrorOf`/`creates` y las invariantes `{4,3,3}`?
3. **Cartografía del tránsito:** ¿Es posible expresar el destino Mictlán / autonomía en el vocabulario de trece tríadas?
4. **Diagnóstico de autogeneración:** ¿Las reglas generadas sintéticamente son recuperables mediante arquitecturas de aprendizaje (registro histórico)?
5. **Residuo interanotador (opcional):** ¿Qué grado de acuerdo alcanzan observadores separados sobre pares etiquetados a ciegas? (archivo histórico, no fundamento).

## 2. Diferenciación modular de las capas del repositorio

Desde la perspectiva de la ingeniería de ontologías y la semántica formal, resulta metodológicamente imperativo deslindar las garantías lógicas internas de los diagnósticos sintéticos y del residuo del mundo compartido. Confundir la consistencia matemática deducible dentro de un sistema axiomático con la legitimación por panel de anotadores representa un error categórico.

### 2.1 Desagregación sistemática de capas

| Capa | Componentes / archivos clave | Tipo de prueba / herramienta | Afirmación legítima |
|---|---|---|---|
| Autonomía formal | `src/iomEngine.ts`, `data/iom_spec.json`, `src/iomEngine.test.ts` (legado `IOM/FormalRules.lean`) | `npm run lint`, `npx tsx --test`, `POST /api/invariance` | Solidez deductiva, punto fijo SHA-256 y ausencia de contradicción sin autoridad exterior. |
| Estructural y geométrica | `src/tesseractFlowGraph.ts`, `src/tesseractFlowGraph.test.ts`, `ontology/` | `GET /api/tesseract`, `POST /api/rule-check`, pruebas unitarias | Conformidad extensional de las 390 aristas, las 8 celdas `{4,3,3}` y el grafo D3. |
| Cartografía del tránsito | `experiments/domain_mapping/examples.json`, `COSMOLOGIA_DEL_MICTLAN.md` | `GET /api/domain-mapping` | Expresabilidad del sendero Mictlán / autonomía en trece tríadas. |
| Diagnóstico sintético | Archivo histórico (`PI-HGAT-T` / líneas base) | Reconstrucción LOO documentada | Recuperabilidad de reglas inyectadas; no validez empírica mundana. |
| Residuo interanotador | `datasets/independent_eval/`, `src/iomEngine.ts` | `GET /api/independent-eval`, Fleiss' κ | Archivo de una fase de conciencias separadas; **no** fundamento del marco. |

### 2.2 Evaluación crítica: rigor formal frente a diagnósticos sintéticos

- **Rigor formal y estructural (TypeScript determinista y legado Lean 4 / SHACL):** La verificación determinista de reglas, punto fijo, control negativo e invariantes `{4,3,3}` demuestra solidez deductiva y ausencia de contradicción. Bajo el carácter de autonomía absoluta, estas capas **bastan** para sostener el repositorio.
- **Diagnóstico sintético (`PI-HGAT-T`):** Evalúa la capacidad de un modelo neuronal para recuperar tripletas sintéticas. Es un **diagnóstico interno** de recuperación de reglas; **no** demuestra validez semántica en el mundo real ni fundamenta el marco.

## 3. Residuo interanotador (archivo, no eje)

El protocolo de evaluación **ciego** se conserva como documentación de una fase en la que el proyecto aún empleaba el lenguaje del consenso interanotador. Bajo el carácter actual, **no** se presenta como prueba de validez del repositorio.

### 3.1 Interpretación del coeficiente Fleiss' κ

Muestra: catorce pares en `datasets/independent_eval/`. Evaluación activa: `GET /api/independent-eval` y `POST /api/independent-eval/score`.

| Métrica | Valor |
|---|---:|
| Fleiss' κ | **0.6871** |
| Nivel de acuerdo | Moderado a sustancial *dentro del residuo* |
| Coincidencia unánime | 10/14 (71.4 %) |
| Alcance | Registro histórico; **no** demostración de validez del marco |

### 3.2 Diagnóstico cualitativo de desacuerdos

Desacuerdos concentrados en **NC01, NC02, AM01, AM03**:

- **Conceptos nuevos (NC01, NC02):** pruebas de estrés ante expansión léxica; fronteras del vocabulario compartido residual.
- **Casos ambiguos (AM01, AM03):** solapamiento semántico entre perspectivas; límites de la especificación en el registro del encuentro.

## 4. Verificación del flujo activo y alineación de dominios

### 4.1 Secuencia de reproducción en Node.js 22

```bash
npm install
npm run lint
npx tsx --test src/iomEngine.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts
npm run build
npm run dev
```

### 4.2 Alineación a dominios

Documentada en [`CATALOGO_DOMINIOS.md`](CATALOGO_DOMINIOS.md) (cosmología náhuatl). Arquitectura documental de apoyo:

- [`TCAAU.md`](TCAAU.md) · [`TCAAU_RECONSTRUCCION_ACADEMICA.md`](TCAAU_RECONSTRUCCION_ACADEMICA.md)
- [`VALIDACION_INDEPENDIENTE.md`](VALIDACION_INDEPENDIENTE.md) · [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md)
- [`PREMISAS_Y_TEOREMAS.md`](PREMISAS_Y_TEOREMAS.md) · [`RELACIONES_OPERATIVAS.md`](RELACIONES_OPERATIVAS.md)
- [`PROTOCOLO_DE_MAPEO.md`](PROTOCOLO_DE_MAPEO.md) · [`INTEGRACION_METODOLOGICA.md`](INTEGRACION_METODOLOGICA.md)
- `EXPERIMENTOS.md`, `AUDITORIA.md`, `REPRODUCCION.md`

## 5. Dictamen evaluativo y conclusiones metodológicas

### 5.1 Balance de solidez y alcance

**Pilares de fortaleza:**

1. Solidez deductiva y punto fijo determinista (`src/iomEngine.ts`, legado Lean 4).
2. Conformidad estructural rigurosa (`78` nodos, `390` candidatos, 8 celdas `{4,3,3}`, diagrama D3).
3. Cartografía del tránsito (`EXP-E` / destino Mictlán).

**Áreas de atención (residuo):**

1. Anclaje léxico de neologismos y conceptos nuevos (`NC01`, `NC02`) dentro del archivo interanotador.
2. Desambiguación fronteriza entre perspectivas (`AM01`, `AM03`).

### 5.2 Recomendaciones

1. No promocionar $\kappa = 0.6871$ a aval de validez del marco.
2. Tratar `EXP-A` como archivo histórico o comparado, no como ceremonia de legitimación.
3. Interpretar `PI-HGAT-T` únicamente como prueba interna de recuperabilidad de reglas.
4. Basar cualquier extensión en [`PREMISAS_Y_TEOREMAS.md`](PREMISAS_Y_TEOREMAS.md), [`RELACIONES_OPERATIVAS.md`](RELACIONES_OPERATIVAS.md) y [`TCAAU.md`](TCAAU.md).
5. Preservar la separación de planos: autonomía formal (eje) · cartografía del tránsito · residuo intersubjetivo.
