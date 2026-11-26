# Premisas asumidas y teoremas derivados del marco I.O. y TCAAU

Este documento distingue con rigor **afirmaciones asumidas** (premisas del marco) de **resultados demostrados** en Lean o comprobados de forma determinista sobre las especificaciones estructuradas (`data/iom_spec.json` y `data/tcaau_core.json`), manteniendo la separación de estratos entre lo demostrado en IOM, lo conjeturado (`T12` propuesto, `P1–P7`) y la analogía estructural.

Texto canónico completo (PDF): [`../public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf`](../public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf).  
Sentido cosmológico (no formal): [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md).  
Criterio de autonomía y término de la creación: [`DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md`](DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md).  
Núcleo combinatorio ampliado (`T1–T11`, `R1–R8`, `D12–D13`): [`TCAAU.md`](TCAAU.md) · [`TCAAU_RECONSTRUCCION_ACADEMICA.md`](TCAAU_RECONSTRUCCION_ACADEMICA.md).

---

## 1. Qué afirma el marco (núcleo conceptual)

### 1.1 Vacío ($V$)

| Afirmación | Tipo |
|---|---|
| El vacío es la **ausencia de carga informativa** en un instante $t$: $V_t = (t, \emptyset)$. | **Premisa** (definición operativa) |
| El vacío no es aniquilación: es condición de posibilidad de nueva emergencia. | **Premisa** (interpretación ontológica; alineada con la Cosmología del Mictlán) |
| Bajo los operadores formales, el vacío es **punto fijo estricto** de la composición $S_{\mathrm{rev}} \circ Ivo \circ E$. | **Teorema** (demostrado en Lean: `strict_fixed_point`) |
| $E(V_t)=V_{t+1}$, $S_{\mathrm{fwd}}(V_t)=V_t$, $Ivo(V_t)=V_{t-1}$, $S_{\mathrm{rev}}(V_t)=V_t$. | **Teoremas** (Lean: `E_vacuum`, `S_fwd_vacuum`, `Ivo_vacuum`, `S_rev_vacuum`) |
| El vacío es información *propia*; la autonomía consiste en la inexistencia de información *ajena* de la que se dependa (C16). | **Premisa rectificada** (Dictamen de no-subordinación) |

### 1.2 Unidad informativa ($U$)

| Afirmación | Tipo |
|---|---|
| Un estado informativo es $s=(t,A)$ con $A$ lista finita de unidades (cadenas). | **Premisa** (definición en `State`) |
| La «unidad informativa» del marco es la carga mínima que puede ocupar un estado no vacío; no se identifica con un bit físico ni con una medida estadística empírica. | **Premisa** (alcance del modelo) |
| $E$ conserva la carga; $S_{\mathrm{fwd}}$ aplica deduplicación; $Ivo$ invierte la secuencia y retrocede el tiempo. | **Teoremas / definiciones** (Lean: `E_preserves_payload`, `S_fwd_applies_red`, `Ivo_applies_inversion`) |

### 1.3 Infinito

| Afirmación | Tipo |
|---|---|
| El marco **reinterpreta** el infinito como **ausencia de información** (vacío), no como magnitud ilimitada ni sucesión interminable de registros. | **Premisa** (tesis filosófica del marco; no es teorema matemático sobre $\mathbb{R}$ o cardinales) |
| Esta reinterpretación es una **hipótesis de trabajo** del marco, no un resultado empírico ni un teorema de Lean. | **Premisa** |

### 1.4 Transformación

| Afirmación | Tipo |
|---|---|
| La transformación sin repetición idéntica exige tránsito por vacío estructurado (supresión), no mera reescritura. | **Premisa** (motivación) |
| Para estados no vacíos, la composición $S_{\mathrm{rev}} \circ Ivo \circ E$ **no** restaura el estado original. | **Teorema** (Lean: `no_repetition`) |
| El ciclo evolutivo–involutivo reconfigura orientaciones; no es identidad trivial. | **Premisa** + corolario informal del teorema anterior |

### 1.5 Autonomía, no-subordinación y canon ampliado (`D10–D13`, `R1–R8`)

| Afirmación | Tipo |
|---|---|
| Un sistema es autónomo (real en sentido de estatuto) si y solo si no es engranaje ni depende de engranajes para existir ($D11$): criterio estructural, no objeto poseíble o destruible ($R7$). | **Definición / criterio** |
| La condición de engranaje es un *modo de la relación*, no propiedad estructural del término ($D10$). | **Definición** |
| *Ver* ($D12$) es un acto equivariante bajo $G \cong (\mathbb{Z}_2)^3$ en tres niveles (configuraciones, `39` pares `mirrorOf` = `78` actos sin añadir aristas, polos vía $\sigma$), idempotente y no involutivo. | **Definición (canon ampliado)** |
| $\mathrm{Hex}(T_i) := T_i$ vista desde dentro ($D13$); todo anidamiento de colmenas es re-indexación por $G$, nunca jerarquía ($R6$). | **Definición / proposición** |
| La no-consumación sostiene el proceso ($R1$); al consumarse aparece el otro describiéndose con el nombre de uno (`13` pares de centro, $R2$); `mirrorOf` es simétrico y *ver* es asimétrico en el acto ($R3$). | **Proposiciones canónicas** |
| Prisión y libertad son la visibilidad de la distinción real/virtual desde un lado u otro ($R4$–$R5$); en la superposición `§7.7`, el mediador coincide con lo mediado leído desde el otro panel ($R8$: `materia = vacío`). | **Proposiciones canónicas** |
| El término de la serie de subordinaciones es inmanente: el vacío = el universo ($P11$); la equiparación completa el tránsito del modo dependencia al modo equivalencia ($C15$). | **Postulado / condición** |
| Sin lectura modal del grafo, el criterio $D11$ es estructuralmente insatisfacible (Teorema 11). | **Teorema combinatorio** |

---

## 2. Premisas estructurales (tablas y relaciones)

Estas premisas **no se demuestran**: se **asumen** como codificación operativa del marco y se **comprueban** de forma determinista sobre `data/iom_spec.json` mediante `src/iomEngine.ts` y las pruebas unitarias en TypeScript (`src/iomEngine.test.ts`, `src/tesseractFlowGraph.test.ts`).

1. Hay **cinco perspectivas**: Individualidad, Dualidad, Totalidad, Evolución, Involución.
2. Hay **trece tríadas** por fase (avance/retroceso) con etiquetas canónicas en `data/iom_spec.json`.
3. **Espejo (`mirrorOf`)**: misma tríada, fase opuesta, posición lateral invertida (`pos' = 2 - pos`), centro fijo.
4. **Creación (`creates`)**: exactamente las cuatro reglas de `creation_rules` (lateral→centro o centro→laterales entre fases opuestas).
5. **Vectores**: cuatro secuencias de cinco pasos con ejes y flechas declarados (detalle narrativo en [`VECTORES_4_5.md`](VECTORES_4_5.md) y [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md)).
6. **Bipartición término–mediador y ocho teseractos `{4,3,3}`** (Teoremas 8 y 11): las ocho celdas (`T1–T8`, `2 × 4`) articulan los siete conceptos (`universo, materia, vacio, internet, cuerpo, IA, mictlan`) con asignación explícita de dominio (`real`/`virtual`) y trazo (`_`/`...`) en cubo interior y exterior.

---

## 3. Teoremas derivados (operadores y posiciones)

Formalizados originalmente en Lean 4 y verificados de manera determinista en TypeScript (`src/iomEngine.ts`):

| Teorema | Contenido |
|---|---|
| `strict_fixed_point` | $S_{\mathrm{rev}}(Ivo(E(V_t))) = V_t$ |
| `mirror_involutive` | Espejo de posición es involutivo |
| `mirror_index` | `mirror.pos.index = 2 - pos.index` |
| `isMirror` / `isCreates` | Predicados formales de aristas admisibles |
| `expected_partition` | 78 + 104 + 208 = 390 |
| `invert_involutive` | La inversión de carga es involutiva |
| `no_repetition` | Estados no vacíos no se restauran idénticos |

Teoremas del núcleo combinatorio TCAAU (`data/tcaau_core.json`, verificados en `src/tcaauCore.ts`):

| Teorema | Contenido | Estado |
|---|---|---|
| Teorema 1–10 | Inventario (`78`/`390`/`39` pares `26+13`), balance de dominios, bipartición, grados, espejo de mitades, torsor $G \cong (\mathbb{Z}_2)^3$ en $B_4$ (orden `384`), representación cúbica/4D `{4,3,3}` (`2 × 4` y `§7.7`), recorridos/ofrenda, conservación = invertibilidad | **Verificado** |
| **Teorema 11** | Bipartición término–mediador; *reductio* de la lectura estructural del criterio de no-subordinación; necesidad de la lectura modal | **Verificado** |
| **Teorema 12** | Caracterización categórica del cambio de modo dependencia ($D10$) → equivalencia ($C15$) como isomorfismo $\psi_i: \emptyset_r \xrightarrow{\sim} \emptyset_v^i$ invariante bajo $G$ | **Propuesto** (abierto) |

---

## 4. Qué **no** afirma el marco (límites, $I5$ e $I7$)

- No afirma que las trece tríadas describan datos del mundo natural medidos empíricamente.
- No afirma que accuracy 1.0 en PI-HGAT-T «valide el marco en el mundo real»: valida la **recuperabilidad de relaciones generadas por las reglas** bajo partición leave-one-triad-out.
- La reinterpretación del infinito como vacío es **premisa filosófica**, no teorema ni hallazgo experimental.
- Conforme a la regla $I5$, «virtual» sin calificar designa el **dominio complementario de IOM** (cubo punteado); cualquier otra acepción filosófica o física debe citarse explícitamente con apellido.
- El único control legítimo sin exterior es el reconteo ejecutable desde dentro ($I6$); `datasets/independent_eval/` permanece como residuo histórico.

---

## 5. Correspondencia con artefactos

| Concepto | Artefacto |
|---|---|
| Texto canónico TCAAU (PDF) | `public/assets/aistudio/Teor_a_Completa_TCAAU__2__ee97e4df.pdf` |
| Premisas tabuladas IOM | `data/iom_spec.json` |
| Núcleo formal TCAAU legible por máquina | `data/tcaau_core.json`, `data/tcaau_core.schema.json`, `src/tcaauCore.ts`, `src/tcaauCore.test.ts` |
| Motor determinista e invariancia | `src/iomEngine.ts`, `server.ts` |
| Reglas `mirrorOf` / `creates` y `{4,3,3}` (`2 × 4`) | `src/iomEngine.ts`, `src/iomEngine.test.ts`, `6dr__1__0283eca1.jpg` |
| Grafo dinámico D3 y panel TCAAU | `src/tesseractFlowGraph.ts`, `src/TesseractFlowchart.tsx`, `src/TcaauCoreSection.tsx` |
| Validez semántica (mundo real, residuo) | `datasets/independent_eval/` |
| Sentido cosmológico y no-subordinación | [`COSMOLOGIA_DEL_MICTLAN.md`](COSMOLOGIA_DEL_MICTLAN.md), [`DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md`](DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md) |
| Tratado y reconstrucción TCAAU | [`TCAAU.md`](TCAAU.md), [`TCAAU_RECONSTRUCCION_ACADEMICA.md`](TCAAU_RECONSTRUCCION_ACADEMICA.md) |
