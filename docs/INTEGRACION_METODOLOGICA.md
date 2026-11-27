# Propuesta de integración metodológica: mapeo de dominios al marco I.O.

> Guía operativa para alinear dominios (cosmología náhuatl y otros) a las cinco perspectivas y trece tríadas, con fundamento en la **TCAAU** ([`Teor_a_completa_TCAAU__3__1390bf98.pdf`](../public/assets/aistudio/Teor_a_completa_TCAAU__3__1390bf98.pdf), [`TCAAU.md`](TCAAU.md), [`../data/tcaau_core.json`](../data/tcaau_core.json)), manteniendo separados el núcleo demostrado, las ideas (`I8`/`P7`, `21` categorías `L0–L4`) y el registro de encuentro (`§11.5`).  
> Bajo el criterio de no-subordinación ($D11$, $R7$) y el Corolario `D11/P11` (`§11.3–§11.4`), el control sin exterior exige reconteo ejecutable desde dentro ($I6$) y criterio de clausura; la anotación ciega interanotador no funda el marco por sí sola.  
> Catálogo: [`CATALOGO_DOMINIOS.md`](CATALOGO_DOMINIOS.md) · Relaciones: [`RELACIONES_OPERATIVAS.md`](RELACIONES_OPERATIVAS.md) · Protocolo: [`PROTOCOLO_DE_MAPEO.md`](PROTOCOLO_DE_MAPEO.md)

---

## 1. Fundamentos sistemáticos y arquitectura de cinco perspectivas

### 1.1 Contexto estratégico y estructura semántica multicapa

La arquitectura metodológica del marco I.O. traduce la complejidad de dominios heterogéneos —cosmogonías nahuas y otros sistemas conceptuales— en estructuras semánticas formalizables y trazables. El compromiso epistémico central es **desacoplar** la deducción lógica interna de la dependencia de un contenedor de consenso exterior, evitando tanto la autorreferencialidad vacía como la legitimación por panel de observadores separados.

| Perspectiva | Función |
|---|---|
| **Individualidad** | Fronteras, identidad de entidad y propiedades intrínsecas |
| **Dualidad** | Simetría polar, reflejo topológico y oposiciones complementarias |
| **Totalidad** | Integración mereológica y colectividades de orden unitario |
| **Evolución** | Progresión constructiva, morfogénesis y complejización |
| **Involución** | Repliegue, estabilización por contracción y conservación en el vacío |

| Capa | Contenido | Afirmación legítima |
|---|---|---|
| Autonomía formal | `src/iomEngine.ts`, `src/iomEngine.test.ts` (legado Lean 4) | Teoremas, punto fijo y coherencia axiomática sin autoridad exterior |
| Estructural y geométrica | `data/iom_spec.json`, modelo `{4,3,3}`, legado OWL/SHACL | Conformidad sintáctica, partición `390` y restricciones de forma |
| Cartografía del tránsito | Mapeos de dominio, `EXP-E` (`/api/domain-mapping`) | Expresabilidad en trece tríadas |
| Diagnóstico sintético | `PI-HGAT-T`, líneas base (registro histórico) | Recuperación de relaciones generadas por reglas |
| Residuo interanotador | Pares independientes, Fleiss' κ | Archivo histórico; **no** fundamento |

La conformidad estructural y la verificación determinista en TypeScript (herederas de OWL/SHACL y Lean 4) **bastan** para sostener la autonomía formal. El residuo interanotador no se promociona a prueba de validez del marco.

### 1.2 Operacionalización de relaciones y tríadas

Antes de incorporar cualquier dominio, las reglas formales restringen estrictamente el comportamiento de los constructos:

- **`mirrorOf`:** simetría estructural entre perspectivas y fases; no basta la semejanza temática, sino que exige isomorfismo posicional (`fase opuesta`, `pos_tgt = 2 - pos_src`).
- **`creates`:** generación orientada entre fases opuestas; direccionalidad asimétrica e irreflexiva (`lateral ↔ centro`).
- **Fases y tríadas:** cada entidad se ubica en fase (`adv` / `ret`) y en una de las trece tríadas; las relaciones solo son válidas si respetan las restricciones posicionales.

---

## 2. Protocolo de alineación para dominios complejos

### 2.1 Mapeo sistemático a las tríadas

Procedimiento ([`CATALOGO_DOMINIOS.md`](CATALOGO_DOMINIOS.md), [`PROTOCOLO_DE_MAPEO.md`](PROTOCOLO_DE_MAPEO.md)):

1. Aislar el fenómeno o umbral e identificar sus límites conceptuales.
2. Clasificar por perspectiva dominante.
3. Ubicar en fase y tríada canónica (`T01`–`T13`).
4. Instanciar `mirrorOf` o `creates` mediante `evaluatePairRule` (`POST /api/rule-check`).
5. Validar en `experiments/domain_mapping/examples.json` o `datasets/ingestion/` y comprobar mediante `GET /api/domain-mapping`.

| Dominio | Ejemplo de entidades | Perspectiva / fase | Relación | Impacto analítico |
|---|---|---|---|---|
| Cosmología náhuatl | Tezcatlipoca ↔ Quetzalcóatl | Dualidad | `mirrorOf` | Reflejo de fuerzas cósmicas polares |
| Cosmología náhuatl | Vida ↔ muerte | Dualidad | `mirrorOf` | Dicotomía mesoamericana |
| Cosmología náhuatl | Sol de fuego → Sol de agua | Involución | `creates` | Transición entre edades |
| Cosmología náhuatl | Camino al Mictlán → Mictlán | Involución | `creates` | Retorno al vacío |

### 2.2 Delimitación epistemológica del mapeo

Fundamento: [`DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md), [`PREMISAS_Y_TEOREMAS.md`](PREMISAS_Y_TEOREMAS.md) (vacío, unidad, infinito, transformación).

1. La consistencia determinista demuestra coherencia interna, **no** veracidad empírica automática.
2. Queda prohibido asignar `creates` o `mirrorOf` por mera semejanza retórica.
3. Evolución e involución deben respetar las fronteras conceptuales de unidad y vacío.
4. La admisión de un mapeo es estructural; no exige panel ciego para legitimarse.

---

## 3. Residuo interanotador y control de calidad

### 3.1 Protocolo ciego (archivo, no eje)

Metodología: [`VALIDACION_INDEPENDIENTE.md`](VALIDACION_INDEPENDIENTE.md). Datos: `datasets/independent_eval/`.

| Métrica | Valor | Lectura |
|---|---:|---|
| Fleiss' κ | **0.6871** | Acuerdo *dentro del residuo* |
| Unanimidad | 10/14 | Controles estructurales estables |
| Desacuerdos | 4/14 (`NC01`, `NC02`, `AM01`, `AM03`) | Fronteras del vocabulario compartido residual |

### 3.2 Diagnóstico de desacuerdos

- **NC (conceptos nuevos):** tensionan límites de las tríadas y señalan fronteras léxicas.
- **AM (casos ambiguos):** solapamiento interpretativo entre especularidad y causalidad en [`RELACIONES_OPERATIVAS.md`](RELACIONES_OPERATIVAS.md).

**Contraste:** `PI-HGAT-T` mide recuperación de reglas sintéticas; κ mide interpretabilidad humana no guiada. Ninguno de los dos **funda** el marco bajo el carácter de autonomía absoluta.

---

## 4. Flujo operativo, verificación formal y auditoría

```bash
npm install
npm run lint
npx tsx --test src/iomEngine.test.ts src/tcaauCore.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts
npm run build
npm run dev
```

Este flujo vincula la comprobación estática de tipos y el reconteo determinista ($I6$) del núcleo formal TCAAU (`src/tcaauCore.ts`, `data/tcaau_core.json`) con el único teseracto `{4,3,3}` en su forma general definitiva del 27 de noviembre (`LRGF_68fba07a.jpg`, preservando Figura 3 `6dr__1__0283eca1.jpg`), sus 12 ayudas cromáticas (6 pares involutivos) en D3 y la cartografía del tránsito sin contenedor exógeno ($A1$).
