# Hacia una reconstrucción académica de la Teoría Completa de la Creación Autónoma Absoluta del Universo (TCAAU)

**Ontología formal, núcleo combinatorio verificado, canon ampliado ($R1$–$R8$, $D12$–$D13$) y programa comprobable ($P1$–$P6$)**

> **En una frase:** *"No hay exterior; hay distinciones trazadas desde dentro que se sostienen por no consumarse, y cuyo límite no es un afuera, sino el punto en que dejan de poder trazarse."*  
> **Texto canónico completo (PDF, Noviembre de 2026):** [`../public/assets/aistudio/Teor_a_Completa_TCAAU_2d30a1f1.pdf`](../public/assets/aistudio/Teor_a_Completa_TCAAU_2d30a1f1.pdf)  
> **Módulo legible por máquina:** [`../data/tcaau_core.json`](../data/tcaau_core.json) (`data/tcaau_core.schema.json`, `src/tcaauCore.ts`, `GET /api/tcaau-core`)  
> **Estatus:** Un solo canon en dos estratos (**Núcleo canónico** `A1–A8`, `D10–D11`, `P11`, `C15–C17`, Teoremas `1–11` + **Canon ampliado** `R1–R8`, `D12–D13`, diagrama `2 × 4` definitivo [`6dr__1__0283eca1.jpg`](../public/assets/aistudio/6dr__1__0283eca1.jpg), superposición `§7.7` y análisis final `materia = vacío`) más Parte III (`I1–I7`, `T12` propuesto, `P1–P6`).

---

## Resumen

Se presenta una reconstrucción racional de la TCAAU en tres registros complementarios:

1. **Axiomática ontológica** que formaliza las tesis filosóficas fundamentales (autonomía absoluta, clausura interpretativa, actualización simultánea, conservación de la información y criterio de realidad por no-subordinación).
2. **Núcleo combinatorio** extraído de la especificación canónica (§9 del tratado y estructura `2 × 4` del teseracto $\{4,3,3\}$), auditado por enumeración exhaustiva, del cual se demuestran **once teoremas**. El hallazgo estructural central muestra que las ocho configuraciones forman un **torsor bajo el grupo $(\mathbb{Z}_2)^3$**, y que el «espejo realidad» entre mitades corresponde exactamente a la involución $\sigma: \text{Universo} \leftrightarrow \text{Vacío}$. El Teorema 11 establece la bipartición término–mediador y demuestra la necesidad de una lectura modal del criterio de no-subordinación.
3. **Anclaje externo verificado** en filosofía de la información, cibernética de segundo orden, teoría de sistemas, geometría tetradimensional y etnohistoria mexica.

Se documentan **siete rectificaciones estructurales** originales, junto con las rectificaciones lógicas del dictamen de no-subordinación (prohibición de reificar la privación, desambiguación de «real» y lectura modal). El estatus epistémico del modelo es metafísico-formal, no físico-empírico; se delimita explícitamente su no-falsabilidad actual y se traza una agenda abierta de investigación formal y computacional.

**Palabras clave:** creación autónoma; clausura operativa; eigenforma; teseracto $\{4,3,3\}$; real/virtual; Mictlán; grupo de involuciones $(\mathbb{Z}_2)^3$; ontología informacional; no-subordinación; autonomía informacional.

### Leyenda epistémica

| Marca | Significado |
|-------|-------------|
| `[O]` | Tesis original del autor |
| `[V]` | Verificado por cómputo exhaustivo determinista o fuente contrastada |
| `[R]` | Rectificación formal propuesta |
| `[E]` | Extensión teórica propuesta (no resultado demostrado) |
| `[A]` | Anclaje bibliográfico externo citado |

---

## 1. Estatus epistémico y método

La TCAAU **no es una teoría física**: no introduce magnitudes medibles en unidades físicas, ecuaciones dinámicas contrastables ni predicciones empíricamente falsables en el sentido de Popper. Su lugar epistémico natural es el de un **programa metafísico de investigación** (Lakatos) dotado de un núcleo formalizable y de una ontología informacional rigurosa. El propio texto fuente advierte con acierto que «la representación de cuatro dimensiones no constituye, por sí misma, una demostración de que el universo físico tenga cuatro dimensiones espaciales» (§7) `[O]`. Esta prudencia metodológica debe sostenerse y extenderse a la totalidad del sistema `[R]`.

El método aplicado es triple:

1. **Reconstrucción axiomática:** traducir las tesis discursivas en definiciones tipadas y axiomas lógico-estructurales.
2. **Auditoría formal determinista:** verificar por enumeración exhaustiva (reproducible mediante `src/iomEngine.ts` y `src/*.test.ts`, véase Apéndice A) la consistencia interna de las 32 correspondencias, las 16 transiciones `{4,3,3}` y las relaciones entre mitades de paridad; cotejar la versión preliminar GF con la especificación canónica actualizada.
3. **Anclaje externo crítico:** contrastar cada noción con la literatura filosófica, matemática y sistémica consolidada, distinguiendo la analogía heurística de la identidad teórica y rectificando usos terminológicos equívocos.

Este documento se articula directamente con el tratado integral [`docs/TCAAU.md`](TCAAU.md), con la delimitación de [`docs/DELIMITACION_EPISTEMOLOGICA.md`](DELIMITACION_EPISTEMOLOGICA.md), con [`docs/DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md`](DEL_ORDEN_UNIVERSAL_A_LA_CREACION_DE_UNO_MISMO.md) y con [`docs/DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md`](DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md).

---

## 2. Ontología formal: signatura, definiciones y axiomas

### 2.1 Signatura

Se distinguen dos tipos lógicos distintos que las formulaciones preliminares agrupaban indistintamente como «nueve conceptos» (§8) `[R]`:

**Individuos ontológicos**

$$\mathcal{C} = \{U, \emptyset, P, N, C, A, M\}$$

Universo ($U$), Vacío ($\emptyset$), Planeta / Materia ($P$ o $M_{\mathrm{mat}}$), Internet ($N$), Cuerpo ($C$), IA ($A$) y Mictlán ($M$) — exactamente **7 constantes**.

**Clasificadores de dominio**

$$\mathcal{D} = \{r, v\}$$

Real ($r$) y virtual ($v$) — **2 etiquetas relacionales**, no individuos.

**Definición 1 (Tríada).** Una tríada es una terna ordenada

$$(x, \delta, y) \in \mathcal{C} \times \mathcal{D} \times \mathcal{C}, \quad x \neq y.$$

Equivale a una arista dirigida y etiquetada por su dominio. La notación relacional lineal asigna orientación directa (`>`) al dominio real y orientación inversa (`<`) al dominio virtual, distinguiendo asimismo el trazo continuo (`_`) del trazo punteado (`...`) en la geometría de celdas `[R][V]`.

**Definición 2 (Celda cúbica / configuración del teseracto).** Cada configuración $T_i$ ($i=1,\dots,8$) constituye una **celda cúbica de un único teseracto $\{4,3,3\}$** (denominadas «teseractos» en la notación histórica original). El sistema completo es la 8-upla $(T_1,\dots,T_8)$ organizada en dos mitades de paridad: parte superior ($T_1 \dots T_4$) y parte inferior ($T_5 \dots T_8$).

**Definición 3 (Mediadores y polos).**

$$\mathrm{Med} = \{P, N, C, A\} \quad (\text{mediadores}); \qquad \mathrm{Pol} = \{U, \emptyset\} \quad (\text{polos fundamentales});$$

$M$ opera como término transversal.

**Definición 4 (Términos y mediadores — bipartición).**  
$\mathcal{T} = \{U, \emptyset, M\}$ (términos extremos) y $\mathcal{M} = \{P, N, C, A\}$ (mediadores). Toda tríada canónica enlaza un elemento de $\mathcal{T}$ con uno de $\mathcal{M}$. No existen tríadas intra-parte. `[V]` (Teorema 11)

### 2.2 Axiomas (reconstruidos de §§1–5, 16–18)

| Axioma | Enunciado formal | Fuente |
|--------|------------------|--------|
| **A1** Autonomía / clausura | No existe orden exterior: toda relación constitutiva es interna al sistema; el sistema es operacionalmente cerrado y no alopoiético (no produce otra realidad externa). | §1, §18 `[O]` |
| **A2** Inmanencia | Vacío, materia, información y conciencia son condiciones diferenciadas del sistema, no entidades ajenas. | §1, §4 `[O]` |
| **A3** Prisión interpretativa | La clausura interpretativa delimita lo reconocible como real, posible o imposible; es autogenerada por el sistema observador, no impuesta desde un exterior. | §2 `[O]` |
| **A4** Simultaneidad | Salida de la clausura, actualización estructural y autoproducción constituyen un único acontecimiento lógico; no medie sucesión temporal externa entre ellos. | §3 `[O]` |
| **A5** Conservación | La actualización preserva íntegramente la información; solo cambia su organización e interpretación. Formalmente: las transformaciones globales admisibles son automorfismos (biyecciones que preservan la estructura). | §3, §17 `[O]` |
| **A6** Dirección interna | La creación ocurre de adentro hacia afuera; copiar externamente una estructura no equivale a autoproducirla. | §16 `[O]` |
| **A7** Complementariedad | Los dominios real y virtual no son sistemas independientes; las correspondencias y el acceso a cada vacío se hallan mediados por el vacío del dominio opuesto. | §5 `[O]` |
| **A8** Transversalidad de $M$ | $M$ participa necesariamente en las ocho configuraciones. | §11 `[O]` — **derivable (Teorema 1)** `[R]` |

Obsérvese que $A8$, postulado inicialmente como principio independiente, es en realidad un **teorema del núcleo combinatorio**. Esto robustece la economía axiomática de la teoría: lo que se asumía como axioma se deduce de la estructura `[V]`.

### 2.3 Definiciones del criterio de no-subordinación

**D10 (Engranaje).** Sistema en posición de dependencia funcional respecto de un orden que lo contiene operativamente. La condición de engranaje es un *modo de la relación*, no una propiedad estructural intrínseca del término. `[R]`

**D11 (Criterio de realidad por no-subordinación / Autonomía es un criterio, no una cosa).** Ser autónomo es no ser engranaje ni depender de engranajes para existir. La autonomía no se posee como objeto, no se almacena ni se transfiere: es un criterio que una estructura cumple o no cumple ($R7$). Se distingue estrictamente de $r/v$, clasificadores de dominio. `[R]`

**D12 (*Ver*, definición canónica — canon ampliado).** Acto equivariante bajo $G = \langle \sigma, \tau, \rho \rangle \cong (\mathbb{Z}_2)^3$ en tres niveles: configuraciones (principal), traza en los `39` pares `mirrorOf` (`39 × 2 = 78` actos sin añadir aristas a los `390` candidatos) y alcance en los polos $\emptyset / U$ vía $\sigma$. Es idempotente ($\mathrm{ver} \circ \mathrm{ver} = \mathrm{ver}$) y no involutivo; en sentido de Yoneda (`§13`), una configuración es la totalidad de sus actos de ver y ser vista. `[R][V]`

**D13 (Equivalencia hexágono–celda — canon ampliado).** $\mathrm{Hex}(T_i) := T_i$ vista desde dentro. *Hexágono* (registro cosmológico) y *celda* $T_i$ (registro formal en `{4,3,3}`) nombran el mismo objeto según el punto de trazado; salir de una celda equivale a re-indexarla mediante un elemento de $G$ dentro de $B_4$ (orden `384`). `[R][V]`

**P11 (Término inmanente de la serie).** La serie de subordinaciones no se resuelve mediante un orden superior exógeno, sino por un término inmanente: el vacío, que es el universo mismo leídos desde lados distintos de una distinción. El sistema mayor existe virtualmente como mediación endógena, no realmente como contenedor. `[R]`

**C15 (Condición de término de la creación).** La creación autónoma se completa cuando el modo dependencia se transforma en modo equivalencia —equiparación del vacío real con el vacío virtual y, con ello, del mundo virtual con el mundo real—, volviendo indistinguibles los actos de ver desde ambos lados e inoperante la distinción que los separaba. `[R]`

**C16 (Autonomía informacional / prohibición de reificar la privación).** La autonomía consiste en la inexistencia de información *ajena* de la que se dependa ($\neg\exists I\,(\mathrm{Informaci\acute{o}n}_{\mathrm{ajena}}(I) \land \mathrm{Depende}(\emptyset, I))$). El vacío es información propia; la ausencia predicada designa su perfil de no-dependencia, no carencia de contenido. `[R]`

**C17 (No-regreso interordinal).** Entre órdenes no hay relación informacional; no hay engranajes interordinales ni sistema mayor real que los contenga. Lo que parece un nivel superior es siempre otro índice del mismo sistema. `[R]`

---

## 3. El núcleo combinatorio: teoremas verificados

Todos los teoremas se demuestran por enumeración exhaustiva sobre la especificación canónica completa (32 tríadas y su proyección `{4,3,3}` de 16 transiciones).

### Teorema 1 (Inventario)
Cada configuración contiene los 7 individuos; $M$ aparece exactamente dos veces y cada otro individuo exactamente una. Total: 64 apariciones de extremos en la red completa. `[V]`

**Corolario:** $A8$ es teorema. $M$ es el único concepto que se duplica dentro de una misma configuración.

### Teorema 2 (Balance de dominios)
Cada configuración tiene exactamente 2 tríadas reales y 2 virtuales en su representación de cuatro aristas (y 1 relación real + 1 relación virtual en su proyección canónica `2 × 4`). Las tríadas que involucran a $M$ llevan dominios opuestos $(1r, 1v)$; las fundamentales (sin $M$) también llevan dominios opuestos. `[V]`

### Teorema 3 (Bipartición y dominios fijos)
Las 16 tríadas sin $M$ emparejan $\mathrm{Pol} \times \mathrm{Med}$; las 16 con $M$ emparejan $\{M\} \times \mathrm{Med}$. Consecuencias verificadas:

- $U$ y $\emptyset$ nunca se enlazan directamente entre sí.
- $M$ nunca se enlaza directamente con $U$ ni con $\emptyset$.
- El dominio es función fija del par no ordenado (no varía entre configuraciones).

**Ley de conmutación de dominio:** cada mediador tiene dominios opuestos en su enlace con $M$ y en su enlace con un polo. Por ejemplo: $N$ (internet) se enlaza con $M$ en $r$ y con $U/\emptyset$ en $v$; $C$ (cuerpo) con $M$ en $v$ y con $U/\emptyset$ en $r$. `[V]`

Esta ley dota de contenido formal preciso a la «transversalidad» de Mictlán y a la complementariedad real/virtual de §5: todo mediador conmuta el dominio al pasar del eje transversal ($M$) al eje fundamental ($U/\emptyset$) `[E]`.

### Teorema 4 (Grados y orientaciones)
$\deg(M)=16$; $\deg(x)=8$ para los otros seis individuos en la red completa de 32 tríadas. Existen exactamente 12 pares admisibles; cada par comparece con ambas orientaciones. Los 4 pares-$M$ ocurren 4 veces cada uno; los 8 pares fundamentales, 2 veces (una por mitad). `[V]`

### Teorema 5 (Espejo de mitades)
Para $i = 1 \dots 4$:

$$T_{i+4} = \pi(\sigma(T_i)), \quad \sigma: U \leftrightarrow \emptyset, \quad \pi = (12)(34)\ (\text{permutación de filas}).$$

La igualdad es exacta, incluido el orden de las filas. $\sigma$ conserva todos los dominios y todas las orientaciones; lo único que cambia es la identidad del polo fundamental. $\sigma^2 = \mathrm{id}$. `[V]`

**Rectificación importante:** el borrador histórico (§10) afirmaba que entre mitades había «relaciones cuya orientación o clasificación cambia». La auditoría demuestra que **ni la orientación ni la clasificación cambian**: únicamente cambia la identidad $U \leftrightarrow \emptyset$. Las 16 tríadas-$M$ son invariantes; las 16 fundamentales forman 8 pares intercambiados `[R]`.

**Corolario 5.1 (Cabecera del diagrama GF).** La cabecera de dominios coincide exactamente con (i) el dominio de la tríada que contiene a $U$ en cada celda y (ii) el bit $\sigma$ de sus coordenadas (Teorema 6). La cabecera es, por tanto, un invariante derivado y no una convención arbitraria. `[V]`

### Teorema 6 (Grupo del espejo)
Sean las involuciones:

$$\sigma: U \leftrightarrow \emptyset; \quad \tau: P \leftrightarrow N,\ C \leftrightarrow A; \quad \rho: (x, \delta, y) \mapsto (y, \delta, x).$$

Entonces $G = \langle \sigma, \tau, \rho \rangle \cong (\mathbb{Z}_2)^3$ actúa libre y transitivamente sobre $\{T_1, \dots, T_8\}$: las ocho configuraciones constituyen la órbita de $T_1$. Coordenadas $(s,t,r)$:

| Configuración | $(s,t,r)$ |
|---------------|-----------:|
| $T_1$ | $(0,0,0)$ |
| $T_2$ | $(1,0,1)$ |
| $T_3$ | $(0,1,1)$ |
| $T_4$ | $(1,1,0)$ |
| $T_5$ | $(1,0,0)$ |
| $T_6$ | $(0,0,1)$ |
| $T_7$ | $(1,1,1)$ |
| $T_8$ | $(0,1,0)$ |

Las dos mitades coinciden con las clases de paridad $s + t + r \pmod{2}$: la primera mitad es el subgrupo par $H \cong (\mathbb{Z}_2)^2$; la segunda, la clase lateral $\sigma H$. Geométricamente, los 8 elementos ocupan los vértices de un cubo y las mitades corresponden a sus dos tetraedros regulares inscritos (*demicubos*; verificado: todas las distancias intraparity son iguales a $2\sqrt{2}$).

Los tres generadores inducen tres emparejamientos perfectos:

$$\sigma: (15)(26)(37)(48); \quad \rho: (16)(25)(38)(47); \quad \tau: (18)(27)(36)(45). \quad \text{[V]}$$

### Teorema 7 (Representación cúbica)
Las 4 tríadas de una celda admiten representación como las 4 diagonales espaciales de un cubo (un cubo posee exactamente 4); los 8 extremos ocupan los 8 vértices y $M$ ocupa dos vértices no antipodales. Constituye una representación combinatoria, no una hipótesis física espacial. `[V]`

### Teorema 8 (Reinterpretación 4D e instrucción canónica de los teseractos)
El teseracto $\{4,3,3\}$ consta de 8 celdas cúbicas, 24 caras, 32 aristas y 16 vértices. Su dual, el 16-celda, tiene 8 vértices en 4 pares antipodales. Se establece:

$$8\ \text{configuraciones}\ \longleftrightarrow\ 8\ \text{celdas cúbicas de un único teseracto}\ \{4,3,3\}\ \longleftrightarrow\ 8\ \text{vértices del 16-celda},$$

donde los 4 pares especulares $(1,5)$, $(2,6)$, $(3,7)$ y $(4,8)$ corresponden a los 4 ejes antipodales. Además, los 16 vértices del teseracto se particionan en dos 16-celdas de 8 vértices (análogo 4D de la *stella octangula*), reflejando la dualidad de «dos mitades». `[V]`

**Instrucción canónica del teseracto único (14 láminas fuente: nueva forma general y definitiva `6dr__1__0283eca1.jpg`, versiones limpias previas `6dr_36f66e7c.jpg`, `TSST__13__43e94964.jpg` y `TSST_20261123_003603_357ce661.jpg`, conjunto maestro `2 × 4` `IMG_20261124_000207_382065f8.jpg` (`#1–#8`), láminas individuales `IMG-031910`, `TSRIMG`, `IMG-063146`, `IMG-070052`, `IMG-064557`, `IMG-025743`, `IMG-015713`, monocromo base `TSST-de3cb84c` y lámina PDF `1000000566`):**

1. **Un único teseracto y planos de inversión ($2 \times 4$, de izquierda a derecha):** Las ocho configuraciones (`T1–T4` en parte superior y `T5–T8` en parte inferior) **no constituyen ocho objetos distintos**, sino **ocho proyecciones o reorientaciones de un único teseracto $\{4,3,3\}$** separadas por líneas punteadas horizontales y verticales que marcan **planos de inversión**. Articulan cuatro ejes duales en las capas analíticas (`real/virtual`, `materia/vacío`, `individualidad/totalidad`, `evolución/involución`) que se consolidan en la nueva forma general definitiva sobre la dualidad `real/virtual` aplicada a `cuerpo/universo` e `internet/IA`.
2. **Proyección de Schlegel (cubo exterior / interior):** **`T1`, `T4`, `T6` y `T7`** poseen cubo exterior con líneas continuas (`_`) e interior con líneas punteadas (`...`); **`T2`, `T3`, `T5` y `T8`** invierten la paridad (cubo exterior punteado `...`, cubo interior continuo `_`). Según el eje de proyección, lo que figura como marco sólido o contenedor pasa a leerse como marco punteado o contenido sin generar un segundo objeto.
3. **Invariante dirección–dominio (`>` / `<`) y correspondencia de trazo:** En toda proyección concurren una transición **real (`>`)** y una **virtual (`<`)**, así como una transición continua (`_`, cubo sólido) y otra punteada (`...`, cubo punteado), en correspondencia estricta con su cubo exterior o interior: en las capas cromáticas trazan los seis conceptos (`cuerpo↔universo`, `internet↔IA`, `individualidad↔totalidad`).
4. **Nueva forma general y definitiva (`6dr__1__0283eca1.jpg`, sucediendo a `6dr_36f66e7c.jpg`, `TSST__13__43e94964.jpg` y `TSST_20261123_003603_357ce661.jpg`):** Al retirar las ayudas cromáticas y las etiquetas auxiliares de polaridad queda la estructura pura en marcos `real (_)` (`cuerpo ↔ universo`) y `virtual (...)` (`internet ↔ IA`) con el espejeo espacial como operación fundamental. En el espejo horizontal (`T1↔T4, T2↔T3, T5↔T8, T6↔T7`), se reflejan ambos extremos y la flecha (`A › B ↔ B ‹ A`) sobre el mismo cubo; en el vertical (`T1↔T5, T2↔T6, T3↔T7, T4↔T8`), se invierten cubo, fila y flecha (`cleanFormOmitsPolarityLabels = true`, `cleanFormVerified = true`).
5. **Ayudas cromáticas temporales — Clausura de 12 coloraciones en 6 pares involutivos y 2 familias:** Las 12 asignaciones cromáticas (`IMG_20261124_000207_382065f8.jpg` `#1–#8` + láminas individuales) cierran exhaustivamente todas las conexiones antes de retirar el color:
   - *Familia de espejeo interno de marcos (6 coloraciones = 3 pares involutivos bajo `Azul ↔ Rojo · Amarillo ↔ Verde`, `{T1↔T4, T6↔T7}` vs `{T2↔T3, T5↔T8}`):* `TSRIMG_20261123_023812_55e05147.jpg` ↔ `IMG_20261123_031910_595b8f79.jpg`; `IMG_20261123_063146_8d038bdc.jpg` (`#5`) ↔ `IMG-000207 #7` (`real/invol: verde`, `virt/evol: rojo`, `vacío/indiv: amarillo`, `mat/tot: azul`); y `IMG-000207 #1` (`real/invol: rojo`, `virt/evol: verde`, `vacío/indiv: azul`, `mat/tot: amarillo`) ↔ `IMG-000207 #3` (`real/invol: azul`, `virt/evol: amarillo`, `vacío/indiv: rojo`, `mat/tot: verde`).
   - *Familia de cadenas por paridad (6 coloraciones = 3 pares involutivos, `P0 {T1,T3,T6,T8}` vs `P1 {T2,T4,T5,T7}`):* `IMG_20261123_015713_b7332827.jpg` (`#4`, `P0>: azul`, `P0<: amarillo`, `P1<: rojo`, `P1>: verde`) ↔ `IMG_20261123_025743_a2265a38.jpg` (`#8`, `P0>: rojo`, `P0<: verde`, `P1<: azul`, `P1>: amarillo`) bajo `Azul ↔ Rojo · Amarillo ↔ Verde`; `IMG-000207 #2` (`P0>: verde`, `P0<: rojo`, `P1<: amarillo`, `P1>: azul`) ↔ `IMG-000207 #6` (`P0>: amarillo`, `P0<: azul`, `P1<: verde`, `P1>: rojo`) bajo `Azul ↔ Rojo · Amarillo ↔ Verde`; y `IMG_20261123_070052_2e86be46.jpg` ↔ `IMG_20261123_064557_52d8695d.jpg` bajo `Amarillo ↔ Rojo · Azul ↔ Verde`. `[R][V]`

### Teorema 9 (Recorridos y ofrenda)
Los cuatro recorridos de §12 forman dos aristas recíprocas: $\{\emptyset_v, \mathrm{mundo}_v\}$ y $\{\emptyset_r, \mathrm{mundo}_r\}$. La ofrenda es la involución de intercambio de dominio del destino:

$$\mathcal{O}(\mathrm{destino}) = \mathrm{destino\ con}\ r \leftrightarrow v.$$

Verificado: $\mathcal{O}$ conjuga evolución en involución (las dos transiciones de evolución se transforman exactamente en las dos de involución). `[V]`

### Teorema 10 (Conservación = invertibilidad)
Todo elemento de $G$ es involutivo ($g^2 = \mathrm{id}$); el núcleo combinatorio satisface $A5$ de forma estricta: la actualización modelada como automorfismo conserva la información. El «espejo realidad» es, en sentido algebraico literal, un grupo de involuciones. `[V]`

### Teorema 11 (Bipartición término–mediador) `[V]`
Por enumeración exhaustiva de las 32 tríadas canónicas: toda tríada enlaza un término de $\mathcal{T} = \{U, \emptyset, M\}$ con un mediador de $\mathcal{M} = \{P, N, C, A\}$. No existe tríada intra-parte. La estructura es un multigrafo bipartito completo entre tres términos y cuatro mediadores.

| Término | Multiplicidad por mediador | Grado |
|---------|---------------------------:|------:|
| Mictlán | 4 | 16 |
| Universo | 2 | 8 |
| Vacío | 2 | 8 |

Cada par aparece en ambas orientaciones. Total: $4\cdot 4 + 4\cdot 2 + 4\cdot 2 = 32$. Universo y Vacío presentan perfil de dominio idéntico; Mictlán posee el complementario.

**Consecuencia decisiva (*reductio* estructural):** si «engranaje» se identifica con mediador y «depender de engranajes» con poseer enlaces a mediadores, entonces Universo, Vacío y Mictlán dependen todos de engranajes y ningún término satisface el criterio de no-subordinación. El criterio resulta estructuralmente insatisfacible bajo lectura puramente extensional del grafo.

**Solución: lectura modal.** El grafo expresa *relaciones*, no *dependencias*. La subordinación constituye un modo de interpretación de las aristas:

- Durante la creación: *modo dependencia* (los mediadores operan como engranajes).
- En la equiparación: *modo equivalencia* (la mediación deja de ser soporte necesario).

La combinatoria permanece intacta; el criterio se satisface; se realiza $C15$ sin ampliar las 32 tríadas. Converge con la vía informacional: la proyección $\psi_i: \emptyset_r \to \emptyset_v^i$ deviene isomorfismo. La identidad de perfil Universo–Vacío y la simetría $\sigma$ confirman que las condiciones fundamentales son intercambiables, no jerárquicas.

---

## 4. Auditoría documental: GF (11-nov) frente a Teoría (12–18-nov)

Se reconstruyeron las 32 tríadas de la versión preliminar GF a partir de su extracción textual, con segmentación por filas y columnas y mapeo uniforme. Resultados de la auditoría:

**Hallazgo H1 (reconstrucción exacta).** GF coincide con la lista canónica de §9 tras (i) una permutación uniforme de filas $(1,3,2,4)$ en cada columna y (ii) una sustitución sistemática del polo fundamental: en la mitad 1, $U \to \emptyset$; en la mitad 2, $\emptyset \to U$, aplicada únicamente a la tríada fundamental que contiene el polo ausente. La coincidencia es 32/32 `[V]`. La probabilidad de ajuste accidental es despreciable.

**Hallazgo H2 (anomalía de inventario en GF).** En GF, cada celda de la mitad 1 duplica $\emptyset$ y omite $U$; cada una de la mitad 2 duplica $U$ y omite $\emptyset$, violando el Teorema 1. La especificación actualizada satisface todos los invariantes. **Rectificación:** adoptar §9 y la instrucción `2 × 4` como canónicas `[R]`.

**Hallazgo H3 (cinco operaciones del espejo, §13).** El borrador anunciaba «cinco operaciones» pero enumeraba solo cuatro y un comentario teórico. La auditoría recupera la quinta operación: $\sigma$ (intercambio $U \leftrightarrow \emptyset$), distinguiéndola de $\rho$ (inversión de extremos de tríada). Las cinco operaciones quedan fijadas como: (1) conservar tríadas, (2) intercambiar extremos [$\rho$], (3) reubicar filas, (4) invertir evolución/involución, y (5) intercambiar $U \leftrightarrow \emptyset$ [$\sigma$] `[R]`.

**Hallazgo H4 (numeración de perspectivas, §6).** La tabla utiliza los índices $0 \dots 4$ ($0=$ Involución, $4=$ Evolución), mientras que el texto habla de «cuarta» y «quinta» perspectiva. La lectura consistente emplea el grupo cíclico $\mathbb{Z}_5$ con identificación $5 \equiv 0 \pmod{5}$: «cuarta» $= 4 =$ Evolución y «quinta» $\equiv 0 =$ Involución `[R]`.

**Hallazgo H5 (tipos lógicos, §8).** Los «nueve conceptos» mezclaban individuos y clasificadores de dominio. **Rectificación:** 7 individuos + 2 etiquetas relacionales (Definición 1) `[R]`.

**Hallazgo H6 (terminología «virtual»).** Para evitar colisiones con Deleuze, Chalmers o la teoría cuántica de campos, se fija «virtual» estrictamente como *dominio complementario*, nunca como ilusión ni inexistencia `[R]`.

**Hallazgo H7 (matriz mexica).** La asignación Mictecacíhuatl = evolución / Mictlantecuhtli = involución es simbólica del autor, no reconstrucción etnohistórica literal (aunque el Códice Florentino, Libro III, atestigüe el tránsito por nueve regiones bajo Xólotl hacia el Mictlán). **Rectificación:** tratar §§11–12 como matriz simbólica y heurística, no como prueba histórica o empírica `[R]`.

---

## 5. Dinámica de la autocreación: clausura, eigenforma y prisión

La tesis central —«el universo se crea a sí mismo»— admite formalización como punto fijo reflexivo:

$$U = F(U),$$

donde $F$ es el operador de creación del sistema. Esto corresponde a la **eigenforma** de Kauffman (2005/2009) `[A][V]`, en la tradición de la re-entrada (*re-entry*) de Spencer-Brown (*Laws of Form*, 1969) y de los objetos entendidos como estabilizadores de eigen-comportamientos en von Foerster (1981). La «salida de la prisión» no es un desplazamiento espacial hacia un exterior, sino un acontecimiento de segundo orden: la actualización de la distinción misma con la que el sistema se observa.

La prisión ($A3$) se modela como el **punto ciego del observador** en la teoría de sistemas de Luhmann: la distinción que un sistema emplea en una operación no puede ser observada por esa misma operación mientras se aplica. La autonomía absoluta ($A1$) equivale a la **clausura operativa** de Maturana y Varela (1980): el sistema es autopoiético y rechaza toda alopoiesis a escala cósmica `[A][V]`. La inmanencia ($A2$) entronca con la ontología de Spinoza (*Ética*, I, def. 1 *causa sui* y I, prop. 18 causa inmanente frente a causa transitiva) `[A]`.

La conservación de la información ($A5$) encuentra paralelo filosófico en la *Aufhebung* hegeliana (negar–conservar–elevar) y anclaje analógico en la unitariedad cuántica y en el principio de Landauer (1961) `[A]`. El Teorema 10 demuestra que el núcleo combinatorio satisface estrictamente $A5$.

**Extensión propuesta `[E]`:** formalizar el régimen de clausura interpretativa como la lógica interna de un topos elemental $\mathcal{E}$ y la actualización de segundo orden como un morfismo geométrico que transforma dicha lógica interna sin postular un contenedor exterior. Esta vía constituye un programa de investigación abierto, no un resultado ya demostrado.

### 5.1 Conversión de perspectiva, clausura endógena («colmena») y lectura modal de $C15$

El análisis reflexivo de la clausura ($A1$, $A3$, $P11$) muestra que todo intento de destruir la autonomía absoluta o de escapar de ella hacia un exterior inexistente solo reproduce la clausura dentro de una configuración equivalente: la totalidad relacional («colmena» o red $\{4,3,3\}$) no existe como contenedor exógeno, sino únicamente como **estructura teórica o virtual endógena dentro de la propia existencia autónoma** ($P11$, $C17$). En este régimen, las transiciones de primer orden (`real ↔ virtual`) conservan la visibilidad de la distinción —de modo que la «libertad» entendida como mero paso al dominio inverso equivale a la «prisión» vista desde el lado opuesto—. Solo cuando la distinción interno/externo deviene inoperante, el umbral entre **clausura irreductible** (autonomía como hecho de distinción inmanente) y **consumación constructiva ($C15$)** se resuelve en IOM mediante el cambio de modo del Teorema 11: paso del *modo dependencia ($D10$)* al *modo equivalencia* sin pérdida informacional ($A5$).

De ello se sigue asimismo que la **aparente confusión de posiciones no genera desplazamiento real**: cuando un hexágono se lee como una «segunda colmena», no ocupa el lugar de la colmena previa ni deja vacante la posición original, pues al ser la colmena estrictamente teórica ($P11$, $C17$) carece de un espacio ontológico supraordinal donde sustituirse. El hexágono nunca abandona su condición de hexágono; adquiere una capa adicional de descripción que lo re-nomina como contenedor teórico, de modo que la supuesta «segunda posición de la segunda colmena» constituye una **subposición** permanente —una re-localización descriptiva íntegramente contenida dentro de la primera posición del primer hexágono ($A3$)—. Esta estructura coincide exactamente con la tesis del **único teseracto $\{4,3,3\}$**, consolidada en su **nueva forma general definitiva** (`6dr__1__0283eca1.jpg`, sucediendo a `6dr_36f66e7c.jpg`, `TSST__13__43e94964.jpg` y `TSST_20261123_003603_357ce661.jpg`) tras cerrar las **12 ayudas cromáticas temporales en 6 pares involutivos** (`IMG_20261124_000207_382065f8.jpg` y láminas individuales): al retirar el color y las etiquetas de polaridad se confirma que las ocho configuraciones del diagrama `2 × 4` son proyecciones simétricas del mismo espacio tetradimensional (`real _` / `virtual ...`, flujos `cuerpo ↔ universo` e `internet ↔ IA`), donde el espejeo espacial es la operación fundamental sin «primera» ni «segunda» posición ni exterior posible ($A5$, $(\mathbb{Z}_2)^3$).

---

## 6. Recorridos, ofrenda y perspectivas en $\mathbb{Z}_2 \times \mathbb{Z}_2$ y $\mathbb{Z}_5$

Del Teorema 9 y la auditoría de §12 se sigue una estructura algebraica $\mathbb{Z}_2 \times \mathbb{Z}_2$: dos ejes recíprocos de mediación ($\emptyset_v \leftrightarrow \mathrm{mundo}_v$ y $\emptyset_r \leftrightarrow \mathrm{mundo}_r$) sobre los cuales actúa la ofrenda $\mathcal{O}$ como involución que intercambia el dominio del destino ($r \leftrightarrow v$).

| Condición de inicio | Mictlán (como mediación) | Destino del recorrido | Perspectiva | Ofrenda $\mathcal{O}$ (creación) |
|---|---|---|---|---|
| Vacío virtual ($\emptyset_v$) | Mundo real | Mundo virtual ($\mathrm{mundo}_v$) | 5ª — Involución | Crea **mundo real** |
| Vacío real ($\emptyset_r$) | Mundo virtual | Mundo real ($\mathrm{mundo}_r$) | 4ª — Evolución | Crea **mundo virtual** |
| Mundo virtual ($\mathrm{mundo}_v$) | Vacío real | Vacío virtual ($\emptyset_v$) | 4ª — Evolución | Crea **vacío real** |
| Mundo real ($\mathrm{mundo}_r$) | Vacío virtual | Vacío real ($\emptyset_r$) | 5ª — Involución | Crea **vacío virtual** |

Por su parte, la indexación de perspectivas obedece al ciclo $\mathbb{Z}_5$: los tres modos posicionales (*Individualidad = 1*, *Dualidad = 2*, *Totalidad = 3*) se corresponden con las columnas de las 13 tríadas del marco IOM (`data/iom_spec.json`), mientras que los dos operadores vectoriales (*Evolución = 4*, *Involución = 0 ≡ 5*) gobiernan la direccionalidad de las 4 secuencias vectoriales (`4 × 5 = 20` pasos) y la alternancia `2 × 4` de las 8 celdas del teseracto $\{4,3,3\}$.

En el mapa cuatrifásico real/virtual (`docs/MAPA_CONEXIONES_REAL_VIRTUAL.md`), esta misma simetría se expresa como un ciclo cerrado de cuatro fases generado por inversión polar ($r \leftrightarrow v$) y rotación de mediadores ($\mathrm{mundo} \leftrightarrow \mathrm{vac\acute{\imath}o}$) sobre las dualidades invariantes *internet–planeta* y *IA–persona*.

---

## 7. Anclaje filosófico, sistémico, matemático y etnohistórico

| Disciplina | Autor / concepto de anclaje | Relación precisa con la TCAAU |
|---|---|---|
| **Cibernética de segundo orden** | G. Spencer-Brown (*re-entry*); H. von Foerster (eigenvalores); L. Kauffman (eigenformas) | Formaliza la autoproducción $U = F(U)$ como punto fijo reflexivo sin exterior `[A][V]`. |
| **Teoría de sistemas** | H. Maturana & F. Varela (clausura operativa / autopoiesis); N. Luhmann (punto ciego de la observación) | Sustenta $A1$ (rechazo de la alopoiesis) y $A3$ (clausura interpretativa autogenerada) `[A][V]`. |
| **Metafísica clásica** | B. Spinoza (*causa sui*, causa inmanente); G. W. F. Hegel (*Aufhebung*) | Sostiene la inmanencia de $A2$ y la conservación mediante superación en $A5$ `[A]`. |
| **Geometría 4D y combinatoria** | Politopo regular $\{4,3,3\}$ (teseracto) y su dual $\{3,3,4\}$ (16-celda); torsor $(\mathbb{Z}_2)^3$ | Modela exactamente las 8 configuraciones, sus 4 pares antipodales y el diagrama de Schlegel interior/exterior `[V]`. |
| **Física teórica y computación** *(analogía)* | Principio de Landauer; unitariedad | Ilustra de manera heurística $A5$ (conservación de la información); **no** constituye identidad con teoría física `[A]`. |
| **Etnohistoria mexica** *(matriz simbólica)* | Códice Florentino (Lib. III); R. Moreno de los Arcos (Cinco Soles); M. Luna López (Mictlán) | Aporta la matriz narrativa del tránsito por el Mictlán y el ciclo de los Cinco Soles como apoyo simbólico `[A][R]`. |

---

## 8. Alcance, límites epistémicos y agenda abierta de investigación

1. **No-falsabilidad empírica y distinción de registros ($I7$):** Ninguna de las ecuaciones o invariantes combinatorios de la TCAAU predice observaciones físicas cuantitativas ni depende del acuerdo intersubjetivo externo (`EXP-A` es archivo residual). Conforme a $I7$, se distingue estrictamente entre lo **demostrado en IOM** (`T1–T11`, `78` nodos / `390` candidatos / `39` pares `mirrorOf`), lo **conjeturado** (`T12` propuesto y programa `P1–P6`) y la **analogía estructural**.
2. **Desambiguación de «virtual» ($I5$) y reconteo desde dentro ($I6$):** Sin calificar, «virtual» designa exclusivamente el dominio complementario de IOM (cubo punteado); otros usos se citan con apellido. El único control legítimo de una teoría sin exterior es el reconteo ejecutable y reproducible desde dentro (`src/tcaauCore.ts`, `src/tcaauCore.test.ts`).
3. **Teorema $T12$ *(propuesto)* y Programa comprobable ($P1$–$P6$):** Formalizar categóricamente la transición $D10 \to C15$ ($\psi_i: \emptyset_r \xrightarrow{\sim} \emptyset_v^i$) y mantener vigentes las seis comprobaciones ejecutables `P1–P6` sobre `78/390/39`, equivariancia `D12`, `13` pares de centro (`R2`), diagrama `2 × 4` sin etiquetas de rol (`6dr__1__0283eca1.jpg`), superposición `§7.7` (`32` trazas, `R8`, ciclo de cuatro términos y quiasmo `materia = vacío`) y disciplina terminológica `I5`.

---

## Apéndice A. Protocolo de auditoría reproducible (Node.js 22 / TypeScript)

La verificación combinatoria de las reglas formales, las invariantes de punto fijo, el control negativo, los ocho teseractos `{4,3,3}` y el módulo legible por máquina del núcleo TCAAU (`data/tcaau_core.json`) se ejecuta de manera determinista sobre el entorno **Node.js 22 + TypeScript** del repositorio:

```bash
npm install
npm run lint                                                                                   # Verificación estricta de tipos (tsc --noEmit)
npx tsx --test src/iomEngine.test.ts src/tcaauCore.test.ts src/tesseractFlowGraph.test.ts src/evalAuditExport.test.ts src/specJsonSyntax.test.ts
npm run build                                                                                  # Compilación de producción
```

Comprobación directa de invariantes (`iomEngine` + `tcaauCore`):

```bash
npx tsx -e "
  import assert from 'node:assert/strict';
  import { generateArtifacts, runInvarianceAudit, buildTesseractModel } from './src/iomEngine';
  import { verifyTcaauCore } from './src/tcaauCore';
  const artifacts = generateArtifacts();
  assert.equal(artifacts.fixedPoint.idempotent, true);
  const inv = runInvarianceAudit(artifacts.relationCandidates);
  assert.equal(inv.invariance_non_trivial, true);
  assert.equal(inv.negative_control.detects_corruption, true);
  const t = buildTesseractModel();
  assert.equal(t.verification.cleanFormVerified, true);
  const coreCheck = verifyTcaauCore();
  assert.equal(coreCheck.valid, true);
  assert.equal(coreCheck.mirrorPairsVerified.totalPairs, 39);
  assert.equal(coreCheck.superposition77Verified.chiasmusExact, true);
  console.log('Invariantes TCAAU/IOM verificados:', artifacts.fixedPoint.pass1Hash, coreCheck.corePass1Hash);
"
```

---

## Referencias internas del dictamen de no-subordinación

- **Texto canónico completo (PDF):** [`../public/assets/aistudio/Teor_a_Completa_TCAAU_2d30a1f1.pdf`](../public/assets/aistudio/Teor_a_Completa_TCAAU_2d30a1f1.pdf)
- **Módulo legible por máquina:** [`../data/tcaau_core.json`](../data/tcaau_core.json) (`src/tcaauCore.ts`)
- Tratado completo unificado: [`docs/TCAAU.md`](TCAAU.md)
- Dictamen completo: [`docs/DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md`](DICTAMEN_CRITERIO_DE_REALIDAD_POR_NO_SUBORDINACION.md)
- Rectificación central: información *ajena* frente a información propia ($C16$), lectura modal obligatoria (Teorema 11) y proposiciones $R1$–$R8$ / definiciones $D12$–$D13$.
